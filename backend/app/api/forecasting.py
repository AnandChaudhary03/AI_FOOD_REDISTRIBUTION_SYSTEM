from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import require_role
from app.models.models import User, UserRole, InventoryItem
from app.services.forecasting_service import (
    predict_product_demand, calculate_reorder_recommendations, run_batch_prediction_job
)

router = APIRouter(prefix="/forecasting", tags=["AI Waste Forecasting & Reorder"])

@router.get("/demand-forecast")
def get_demand_forecasts(
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db)
):
    """
    Returns 7-day and 30-day AI time-series demand predictions per product category.
    """
    items = db.query(InventoryItem).filter(InventoryItem.business_id == current_user.id).all()
    forecasts = []
    for item in items:
        days_left = (item.expiry_date - item.created_at).days if (item.expiry_date and item.created_at) else 14
        forecast = predict_product_demand(item.product_name, item.category or "General", item.quantity, days_left)
        forecasts.append(forecast)
        
    return {
        "business_id": current_user.id,
        "total_items_analyzed": len(items),
        "forecasts": forecasts
    }

@router.get("/reorder-recommendations")
def get_reorder_recommendations(
    storage_capacity: float = 500.0,
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db)
):
    """
    Smart Reorder Recommendation Module:
    Returns optimal stock purchase quantities based on demand forecasts & storage capacity.
    """
    items = db.query(InventoryItem).filter(InventoryItem.business_id == current_user.id).all()
    reorders = calculate_reorder_recommendations(items, storage_capacity_limit=storage_capacity)
    
    total_suggested_reorder_qty = sum(r["suggested_reorder_qty"] for r in reorders)
    total_estimated_savings = sum(r["estimated_cost_savings_inr"] for r in reorders)
    critical_items_count = sum(1 for r in reorders if r["reorder_required"])
    
    return {
        "business_id": current_user.id,
        "storage_capacity_limit": storage_capacity,
        "critical_reorder_items_count": critical_items_count,
        "total_suggested_reorder_qty": total_suggested_reorder_qty,
        "total_estimated_savings_inr": total_estimated_savings,
        "recommendations": reorders
    }

@router.post("/trigger-batch")
def trigger_batch_prediction(
    current_user: User = Depends(require_role(UserRole.business)),
    db: Session = Depends(get_db)
):
    """
    Triggers manual on-demand batch waste risk prediction run across business inventory.
    """
    result = run_batch_prediction_job(db, business_id=current_user.id)
    return {
        "message": "Batch waste risk prediction run completed successfully",
        "result": result
    }
