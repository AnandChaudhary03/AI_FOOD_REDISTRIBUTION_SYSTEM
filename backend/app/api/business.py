from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.auth import get_current_user, require_role
from app.models.models import User, UserRole, InventoryItem, Donation, DonationStatus, Transaction
from app.schemas.schemas import InventoryItemCreate, InventoryItemOut, DonationCreate, DonationOut
from app.services.barcode_service import lookup_barcode
from app.services.ai_service import calculate_urgency_score, calculate_match_score, get_surplus_predictions, co2_saved_kg
from datetime import datetime
import csv
import io

router = APIRouter(prefix="/business", tags=["Business"])

@router.get("/dashboard")
def get_dashboard(current_user: User = Depends(require_role(UserRole.business)), db: Session = Depends(get_db)):
    items = db.query(InventoryItem).filter(InventoryItem.business_id == current_user.id).all()
    donations = db.query(Donation).filter(Donation.business_id == current_user.id).all()
    delivered = [d for d in donations if d.status == DonationStatus.delivered]
    expiring_soon = [i for i in items if i.expiry_date and (i.expiry_date - datetime.utcnow()).days <= 7]
    total_food_saved = sum(d.quantity for d in delivered)
    return {
        "total_inventory_items": len(items),
        "total_donations": len(donations),
        "delivered_count": len(delivered),
        "expiring_soon_count": len(expiring_soon),
        "food_saved_kg": total_food_saved,
        "co2_saved_kg": co2_saved_kg(total_food_saved),
        "pending_donations": len([d for d in donations if d.status == DonationStatus.pending]),
        "ai_alerts": [
            {"item": i.product_name, "urgency": i.ai_urgency_score, "days_left": (i.expiry_date - datetime.utcnow()).days if i.expiry_date else None}
            for i in expiring_soon[:5]
        ]
    }

@router.get("/inventory")
def get_inventory(
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db),
    skip: int = 0, limit: int = 100,
    search: Optional[str] = None, status: Optional[str] = None
):
    q = db.query(InventoryItem).filter(InventoryItem.business_id == current_user.id)
    if search and search.strip():
        q = q.filter(InventoryItem.product_name.ilike(f"%{search.strip()}%"))
    if status:
        q = q.filter(InventoryItem.status == status)
    items = q.order_by(InventoryItem.created_at.desc()).offset(skip).limit(limit).all()
    result = []
    for item in items:
        urgency = calculate_urgency_score(item.expiry_date, item.quantity)
        result.append({
            "id": item.id,
            "barcode": item.barcode,
            "product_name": item.product_name,
            "category": item.category or "General",
            "quantity": item.quantity or 1,
            "unit": item.unit or "kg",
            "expiry_date": item.expiry_date.strftime("%Y-%m-%d") if (item.expiry_date and hasattr(item.expiry_date, 'strftime')) else str(item.expiry_date or ''),
            "description": item.description,
            "status": item.status or "available",
            "ai_urgency_score": urgency,
            "created_at": item.created_at.strftime("%Y-%m-%d %H:%M") if (item.created_at and hasattr(item.created_at, 'strftime')) else str(item.created_at or '')
        })
    return result

@router.post("/inventory", response_model=InventoryItemOut)
def add_inventory_item(
    item: InventoryItemCreate,
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db)
):
    urgency = calculate_urgency_score(item.expiry_date, item.quantity)
    db_item = InventoryItem(
        business_id=current_user.id,
        barcode=item.barcode,
        product_name=item.product_name,
        category=item.category,
        quantity=item.quantity,
        unit=item.unit,
        expiry_date=item.expiry_date,
        description=item.description,
        image_url=item.image_url,
        ai_urgency_score=urgency
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/inventory/{item_id}")
def update_inventory_item(item_id: int, item: InventoryItemCreate, current_user: User = Depends(require_role(UserRole.business)), db: Session = Depends(get_db)):
    db_item = db.query(InventoryItem).filter(InventoryItem.id == item_id, InventoryItem.business_id == current_user.id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    for k, v in item.dict(exclude_unset=True).items():
        setattr(db_item, k, v)
    db_item.ai_urgency_score = calculate_urgency_score(db_item.expiry_date, db_item.quantity)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/inventory/{item_id}")
def delete_inventory_item(item_id: int, current_user: User = Depends(require_role(UserRole.business)), db: Session = Depends(get_db)):
    db_item = db.query(InventoryItem).filter(InventoryItem.id == item_id, InventoryItem.business_id == current_user.id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted"}

@router.get("/barcode/{barcode}")
async def scan_barcode(barcode: str, current_user: User = Depends(require_role(UserRole.business)), db: Session = Depends(get_db)):
    clean_barcode = barcode.strip()
    db_item = db.query(InventoryItem).filter(InventoryItem.barcode == clean_barcode, InventoryItem.business_id == current_user.id).first()
    if db_item:
        return {
            "barcode": clean_barcode,
            "product_name": db_item.product_name,
            "category": db_item.category or "General",
            "quantity": db_item.quantity,
            "unit": db_item.unit,
            "found": True,
            "source": "database"
        }
    result = await lookup_barcode(clean_barcode)
    return result

@router.post("/inventory/csv-upload")
async def upload_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db)
):
    content = await file.read()
    try:
        text = content.decode("utf-8")
        reader = csv.DictReader(io.StringIO(text))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV format")

    added = 0
    for row in reader:
        if "product_name" not in row or "quantity" not in row:
            continue
        expiry = None
        if row.get("expiry_date"):
            try:
                expiry = datetime.strptime(row["expiry_date"].strip(), "%Y-%m-%d")
            except:
                pass
        item = InventoryItem(
            business_id=current_user.id,
            product_name=str(row["product_name"]).strip(),
            category=str(row.get("category", "")).strip() or None,
            quantity=float(row["quantity"]),
            unit=str(row.get("unit", "kg")).strip(),
            expiry_date=expiry,
            barcode=str(row.get("barcode", "")).strip() or None,
            ai_urgency_score=calculate_urgency_score(expiry, float(row["quantity"]))
        )
        db.add(item)
        added += 1
    db.commit()
    return {"message": f"Successfully added {added} items", "count": added}

@router.get("/donations", response_model=List[DonationOut])
def get_donations(current_user: User = Depends(require_role(UserRole.business)), db: Session = Depends(get_db)):
    return db.query(Donation).filter(Donation.business_id == current_user.id).order_by(Donation.created_at.desc()).all()

@router.post("/donations", response_model=DonationOut)
def create_donation(donation: DonationCreate, current_user: User = Depends(require_role(UserRole.business)), db: Session = Depends(get_db)):
    if donation.expiry_date and donation.expiry_date.date() < datetime.utcnow().date():
        raise HTTPException(status_code=400, detail="Expired food items cannot be donated for safety reasons")
    db_donation = Donation(
        business_id=current_user.id,
        item_id=donation.item_id,
        product_name=donation.product_name,
        category=donation.category,
        quantity=donation.quantity,
        unit=donation.unit,
        expiry_date=donation.expiry_date,
        description=donation.description,
        pickup_address=donation.pickup_address or current_user.address,
        lat=donation.lat or current_user.lat,
        lng=donation.lng or current_user.lng,
        ai_match_score=calculate_match_score(donation.quantity)
    )
    db.add(db_donation)
    if donation.item_id:
        item = db.query(InventoryItem).filter(InventoryItem.id == donation.item_id).first()
        if item:
            item.status = "donated"
    db.commit()
    db.refresh(db_donation)
    return db_donation

@router.get("/transactions")
def get_transactions(current_user: User = Depends(require_role(UserRole.business)), db: Session = Depends(get_db)):
    txns = db.query(Transaction).filter(Transaction.from_user_id == current_user.id).order_by(Transaction.created_at.desc()).all()
    return [{"id": t.id, "type": t.type, "quantity": t.quantity, "unit": t.unit, "notes": t.notes, "created_at": t.created_at} for t in txns]

@router.get("/nearby-ngos")
def nearby_ngos(current_user: User = Depends(require_role(UserRole.business)), db: Session = Depends(get_db), radius_km: float = 50):
    from app.services.ai_service import haversine_distance
    ngos = db.query(User).filter(User.role == UserRole.ngo, User.is_active == True).all()
    result = []
    for ngo in ngos:
        dist = None
        if current_user.lat and current_user.lng and ngo.lat and ngo.lng:
            dist = haversine_distance(current_user.lat, current_user.lng, ngo.lat, ngo.lng)
            if dist > radius_km:
                continue
        result.append({
            "id": ngo.id, "name": ngo.name, "organization_name": ngo.organization_name,
            "address": ngo.address, "lat": ngo.lat, "lng": ngo.lng, "distance_km": dist
        })
    return sorted(result, key=lambda x: x["distance_km"] or 999)
