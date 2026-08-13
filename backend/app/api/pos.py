import secrets
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, require_role
from app.models.models import User, UserRole, InventoryItem, POSApiKey, POSLog, Transaction
from app.schemas.schemas import (
    POSApiKeyCreate, POSSaleSync, POSInventorySyncPayload
)
from app.services.ai_service import calculate_urgency_score

router = APIRouter(prefix="/pos", tags=["POS System Integration"])

def get_pos_business(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    db: Session = Depends(get_db)
) -> tuple[User, POSApiKey]:
    """Helper dependency to authenticate POS requests via X-API-Key header."""
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-API-Key header for POS authentication"
        )
    key_obj = db.query(POSApiKey).filter(
        POSApiKey.api_key == x_api_key.strip(),
        POSApiKey.is_active == True
    ).first()
    if not key_obj:
        raise HTTPException(
            status_code=status.HTTP,
            detail="Invalid or revoked POS API Key"
        )
    user = db.query(User).filter(User.id == key_obj.business_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Associated Business account is inactive or disabled"
        )
    # Update last_used_at timestamp
    key_obj.last_used_at = datetime.utcnow()
    db.commit()
    return user, key_obj

# -------------------------------------------------------------------
# 1. POS API Key Management Endpoints (Used by Business UI)
# -------------------------------------------------------------------

@router.get("/api-keys")
def list_api_keys(
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db)
):
    keys = db.query(POSApiKey).filter(
        POSApiKey.business_id == current_user.id
    ).order_by(POSApiKey.created_at.desc()).all()
    
    return [
        {
            "id": k.id,
            "name": k.name,
            "api_key": k.api_key,
            "pos_provider": k.pos_provider,
            "is_active": k.is_active,
            "last_used_at": k.last_used_at.strftime("%Y-%m-%d %H:%M") if k.last_used_at else "Never",
            "created_at": k.created_at.strftime("%Y-%m-%d %H:%M") if k.created_at else None
        }
        for k in keys
    ]

@router.post("/api-keys")
def generate_api_key(
    payload: POSApiKeyCreate,
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db)
):
    raw_token = f"pos_live_{secrets.token_hex(16)}"
    new_key = POSApiKey(
        business_id=current_user.id,
        name=payload.name or "POS Register Key",
        api_key=raw_token,
        pos_provider=payload.pos_provider or "Custom POS",
        is_active=True
    )
    db.add(new_key)
    db.commit()
    db.refresh(new_key)
    return {
        "message": "POS API Key generated successfully",
        "key_id": new_key.id,
        "name": new_key.name,
        "api_key": new_key.api_key,
        "pos_provider": new_key.pos_provider
    }

@router.delete("/api-keys/{key_id}")
def revoke_api_key(
    key_id: int,
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db)
):
    key_obj = db.query(POSApiKey).filter(
        POSApiKey.id == key_id,
        POSApiKey.business_id == current_user.id
    ).first()
    if not key_obj:
        raise HTTPException(status_code=404, detail="API key not found")
    key_obj.is_active = False
    db.commit()
    return {"message": "POS API Key revoked successfully"}

@router.get("/logs")
def get_pos_logs(
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db)
):
    logs = db.query(POSLog).filter(
        POSLog.business_id == current_user.id
    ).order_by(POSLog.created_at.desc()).limit(50).all()
    
    return [
        {
            "id": l.id,
            "pos_provider": l.pos_provider,
            "event_type": l.event_type,
            "items_synced": l.items_synced,
            "details": l.details,
            "status": l.status,
            "created_at": l.created_at.strftime("%Y-%m-%d %H:%M") if l.created_at else None
        }
        for l in logs
    ]

# -------------------------------------------------------------------
# 2. REST API Endpoints for Third-Party POS Hardware/Software Integration
# -------------------------------------------------------------------

@router.post("/sync-sale")
def sync_pos_sale(
    payload: POSSaleSync,
    auth_data: tuple[User, POSApiKey] = Depends(get_pos_business),
    db: Session = Depends(get_db)
):
    """
    Called by POS systems (Square, Toast, Clover, custom POS) upon register checkout.
    Deducts sold stock from AnnaSetu Business Inventory in real-time.
    """
    business, key_obj = auth_data
    items_updated = 0
    updated_details = []

    for sale_item in payload.items:
        qty_sold = float(sale_item.quantity_sold or 0)
        if qty_sold <= 0:
            continue

        item_db = None
        if sale_item.barcode:
            item_db = db.query(InventoryItem).filter(
                InventoryItem.business_id == business.id,
                InventoryItem.barcode == sale_item.barcode.strip()
            ).first()

        if not item_db and sale_item.product_name:
            item_db = db.query(InventoryItem).filter(
                InventoryItem.business_id == business.id,
                InventoryItem.product_name.ilike(f"%{sale_item.product_name.strip()}%")
            ).first()

        if item_db:
            new_qty = max(0.0, float(item_db.quantity) - qty_sold)
            item_db.quantity = new_qty
            if new_qty == 0:
                item_db.status = "out_of_stock"
            item_db.ai_urgency_score = calculate_urgency_score(item_db.expiry_date, new_qty)
            items_updated += 1
            updated_details.append(f"{item_db.product_name} (-{qty_sold} {item_db.unit})")

    # Record POS Audit Log
    pos_log = POSLog(
        business_id=business.id,
        api_key_id=key_obj.id,
        pos_provider=payload.pos_provider or key_obj.pos_provider,
        event_type="sync_sale",
        items_synced=items_updated,
        details=", ".join(updated_details) if updated_details else "No matching stock found",
        status="success"
    )
    db.add(pos_log)
    db.commit()

    return {
        "success": True,
        "message": f"Successfully processed POS sale sync. {items_updated} stock items updated.",
        "items_updated_count": items_updated,
        "updated_items": updated_details
    }

@router.post("/sync-inventory")
def sync_pos_inventory(
    payload: POSInventorySyncPayload,
    auth_data: tuple[User, POSApiKey] = Depends(get_pos_business),
    db: Session = Depends(get_db)
):
    """
    Bulk POS inventory sync. Accepts batch stock levels from POS systems.
    Creates new inventory items or updates stock levels for existing items.
    """
    business, key_obj = auth_data
    created_count = 0
    updated_count = 0

    for p_item in payload.items:
        exp_date = None
        if p_item.expiry_date:
            try:
                exp_date = datetime.strptime(p_item.expiry_date.strip(), "%Y-%m-%d")
            except:
                exp_date = None

        existing = None
        if p_item.barcode:
            existing = db.query(InventoryItem).filter(
                InventoryItem.business_id == business.id,
                InventoryItem.barcode == p_item.barcode.strip()
            ).first()

        if not existing and p_item.product_name:
            existing = db.query(InventoryItem).filter(
                InventoryItem.business_id == business.id,
                InventoryItem.product_name.ilike(f"%{p_item.product_name.strip()}%")
            ).first()

        urgency = calculate_urgency_score(exp_date, float(p_item.quantity))

        if existing:
            existing.quantity = float(p_item.quantity)
            existing.category = p_item.category or existing.category or "General"
            existing.unit = p_item.unit or existing.unit or "kg"
            if exp_date:
                existing.expiry_date = exp_date
            existing.ai_urgency_score = urgency
            existing.status = "available" if float(p_item.quantity) > 0 else "out_of_stock"
            updated_count += 1
        else:
            new_item = InventoryItem(
                business_id=business.id,
                barcode=p_item.barcode,
                product_name=p_item.product_name.strip(),
                category=p_item.category or "General",
                quantity=float(p_item.quantity),
                unit=p_item.unit or "kg",
                expiry_date=exp_date,
                description=p_item.description or f"Synced from {payload.pos_provider or 'POS'}",
                status="available" if float(p_item.quantity) > 0 else "out_of_stock",
                ai_urgency_score=urgency
            )
            db.add(new_item)
            created_count += 1

    pos_log = POSLog(
        business_id=business.id,
        api_key_id=key_obj.id,
        pos_provider=payload.pos_provider or key_obj.pos_provider,
        event_type="sync_inventory",
        items_synced=created_count + updated_count,
        details=f"Created {created_count} new items, updated {updated_count} items",
        status="success"
    )
    db.add(pos_log)
    db.commit()

    return {
        "success": True,
        "message": f"POS Inventory Sync complete: {created_count} created, {updated_count} updated.",
        "created_count": created_count,
        "updated_count": updated_count
    }

@router.post("/webhook")
def pos_webhook(
    payload: dict,
    auth_data: tuple[User, POSApiKey] = Depends(get_pos_business),
    db: Session = Depends(get_db)
):
    """
    Webhook listener for real-time POS push events (Square / Toast Webhooks).
    """
    business, key_obj = auth_data
    event_type = payload.get("event_type", "webhook_push")
    
    pos_log = POSLog(
        business_id=business.id,
        api_key_id=key_obj.id,
        pos_provider=key_obj.pos_provider,
        event_type=f"webhook_{event_type}",
        items_synced=1,
        details=f"Received webhook payload: {str(payload)[:200]}",
        status="success"
    )
    db.add(pos_log)
    db.commit()

    return {"status": "received", "event_type": event_type}
