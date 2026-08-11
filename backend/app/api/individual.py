from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.core.database import get_db
from app.api.auth import require_role
from app.models.models import User, UserRole, Donation, DonationStatus
from app.services.ai_service import co2_saved_kg

router = APIRouter(prefix="/individual", tags=["Individual Donor"])

class IndividualDonationCreate(BaseModel):
    product_name: str
    category: Optional[str] = "Household Surplus"
    quantity: float
    unit: Optional[str] = "kg"
    expiry_date: Optional[str] = None
    pickup_address: Optional[str] = None
    description: Optional[str] = None

@router.get("/dashboard")
def get_individual_dashboard(current_user: User = Depends(require_role(UserRole.individual)), db: Session = Depends(get_db)):
    donations = db.query(Donation).filter(Donation.business_id == current_user.id).all()
    delivered = [d for d in donations if d.status == DonationStatus.delivered]
    pending = [d for d in donations if d.status == DonationStatus.pending]
    accepted = [d for d in donations if d.status == DonationStatus.accepted]
    in_transit = [d for d in donations if d.status == DonationStatus.in_transit]

    total_food_saved = sum(d.quantity for d in delivered)
    meals_served = int(total_food_saved * 2.5)  # Avg 2.5 meals per kg

    return {
        "total_donations": len(donations),
        "pending_donations": len(pending),
        "active_donations": len(accepted) + len(in_transit),
        "delivered_donations": len(delivered),
        "food_saved_kg": round(total_food_saved, 1),
        "meals_served": meals_served,
        "co2_saved_kg": co2_saved_kg(total_food_saved),
        "recent_donations": [
            {
                "id": d.id,
                "product_name": d.product_name,
                "quantity": d.quantity,
                "unit": d.unit,
                "status": d.status.value if hasattr(d.status, 'value') else d.status,
                "created_at": d.created_at.strftime("%Y-%m-%d %H:%M") if d.created_at else None,
                "pickup_address": d.pickup_address or current_user.address
            }
            for d in donations[-5:]
        ]
    }

@router.get("/donations")
def get_individual_donations(current_user: User = Depends(require_role(UserRole.individual)), db: Session = Depends(get_db)):
    donations = db.query(Donation).filter(Donation.business_id == current_user.id).order_by(Donation.created_at.desc()).all()
    return [
        {
            "id": d.id,
            "product_name": d.product_name,
            "category": d.category,
            "quantity": d.quantity,
            "unit": d.unit,
            "status": d.status.value if hasattr(d.status, 'value') else d.status,
            "expiry_date": d.expiry_date.strftime("%Y-%m-%d") if d.expiry_date else None,
            "created_at": d.created_at.strftime("%Y-%m-%d %H:%M") if d.created_at else None,
            "pickup_address": d.pickup_address or current_user.address,
            "description": d.description
        }
        for d in donations
    ]

@router.post("/donations")
def create_individual_donation(
    payload: IndividualDonationCreate,
    current_user: User = Depends(require_role(UserRole.individual)),
    db: Session = Depends(get_db)
):
    exp_date = None
    if payload.expiry_date:
        try:
            exp_date = datetime.strptime(payload.expiry_date, "%Y-%m-%d")
        except:
            exp_date = None

    if exp_date and exp_date.date() < datetime.utcnow().date():
        raise HTTPException(status_code=400, detail="Expired food items cannot be donated for safety reasons")

    new_donation = Donation(
        business_id=current_user.id,
        product_name=payload.product_name,
        category=payload.category or "Household Surplus",
        quantity=payload.quantity,
        unit=payload.unit or "kg",
        expiry_date=exp_date,
        pickup_address=payload.pickup_address or current_user.address,
        description=payload.description,
        status=DonationStatus.pending
    )
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)

    return {
        "message": "Home surplus food donation submitted successfully! Nearby NGOs will be notified for pickup.",
        "donation_id": new_donation.id
    }

@router.get("/map")
def get_nearby_ngos(current_user: User = Depends(require_role(UserRole.individual)), db: Session = Depends(get_db)):
    ngos = db.query(User).filter(User.role == UserRole.ngo).all()
    return [
        {
            "id": n.id,
            "name": n.name,
            "organization_name": n.organization_name or n.name,
            "phone": n.phone,
            "address": n.address or "City Food Salvage Hub",
            "latitude": n.latitude or 28.6139,
            "longitude": n.longitude or 77.2090,
            "distance_km": round(1.2 + (n.id * 0.4) % 4.5, 1)
        }
        for n in ngos
    ]

@router.get("/impact")
def get_individual_impact(current_user: User = Depends(require_role(UserRole.individual)), db: Session = Depends(get_db)):
    donations = db.query(Donation).filter(Donation.business_id == current_user.id).all()
    delivered = [d for d in donations if d.status == DonationStatus.delivered]
    total_food_saved = sum(d.quantity for d in delivered)
    meals_served = int(total_food_saved * 2.5)

    return {
        "donor_name": current_user.name,
        "total_donations_submitted": len(donations),
        "total_food_saved_kg": round(total_food_saved, 1),
        "meals_served": meals_served,
        "co2_saved_kg": co2_saved_kg(total_food_saved),
        "badge_title": "Hunger Salvation Champion" if total_food_saved > 50 else "Surplus Food Hero",
        "impact_history": [
            {
                "id": d.id,
                "item": d.product_name,
                "quantity": d.quantity,
                "unit": d.unit,
                "meals": int(d.quantity * 2.5),
                "date": d.created_at.strftime("%Y-%m-%d") if d.created_at else "Recent"
            }
            for d in delivered
        ]
    }
