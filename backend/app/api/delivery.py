from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, require_role
from app.models.models import User, UserRole, Donation, DonationStatus, Pickup, Transaction
from app.services.otp_service import verify_otp
from app.services.ai_service import haversine_distance
from datetime import datetime

router = APIRouter(prefix="/delivery", tags=["Delivery"])

@router.get("/dashboard")
def get_dashboard(current_user: User = Depends(require_role(UserRole.delivery)), db: Session = Depends(get_db)):
    my_pickups = db.query(Pickup).filter(Pickup.delivery_partner_id == current_user.id).all()
    completed = [p for p in my_pickups if p.status == "delivered"]
    active = [p for p in my_pickups if p.status in ["assigned", "picked"]]
    return {
        "total_deliveries": len(my_pickups),
        "completed_deliveries": len(completed),
        "active_deliveries": len(active),
        "pending_available": 0
    }

@router.get("/available-pickups")
def get_available_pickups(
    current_user: User = Depends(require_role(UserRole.delivery)),
    db: Session = Depends(get_db),
    radius_km: float = 50
):
    pickups = db.query(Pickup).filter(
        Pickup.delivery_partner_id == None,
        Pickup.status == "pending"
    ).all()
    result = []
    for p in pickups:
        donation = db.query(Donation).filter(Donation.id == p.donation_id).first()
        if not donation:
            continue
        dist = None
        if current_user.lat and current_user.lng and donation.lat and donation.lng:
            dist = haversine_distance(current_user.lat, current_user.lng, donation.lat, donation.lng)
            if dist > radius_km:
                continue
        recipient = db.query(User).filter(User.id == donation.accepted_by_id).first()
        result.append({
            "pickup_id": p.id,
            "donation_id": p.donation_id,
            "product_name": donation.product_name,
            "quantity": donation.quantity,
            "unit": donation.unit,
            "pickup_address": donation.pickup_address,
            "pickup_lat": donation.lat,
            "pickup_lng": donation.lng,
            "recipient_name": recipient.organization_name or recipient.name if recipient else "",
            "recipient_address": recipient.address if recipient else "",
            "recipient_lat": recipient.lat if recipient else None,
            "recipient_lng": recipient.lng if recipient else None,
            "distance_km": dist,
            "scheduled_time": p.scheduled_time,
        })
    return sorted(result, key=lambda x: x["distance_km"] or 999)

@router.post("/pickups/{pickup_id}/accept")
def accept_pickup(pickup_id: int, current_user: User = Depends(require_role(UserRole.delivery)), db: Session = Depends(get_db)):
    pickup = db.query(Pickup).filter(Pickup.id == pickup_id, Pickup.delivery_partner_id == None).first()
    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup not found or already assigned")
    pickup.delivery_partner_id = current_user.id
    pickup.status = "assigned"
    donation = db.query(Donation).filter(Donation.id == pickup.donation_id).first()
    if donation:
        donation.delivery_partner_id = current_user.id
        donation.status = DonationStatus.in_transit
    db.commit()
    return {"message": "Pickup accepted", "otp_code": pickup.otp_code}

@router.post("/pickups/{pickup_id}/verify-otp")
def verify_delivery_otp(pickup_id: int, otp_code: str, current_user: User = Depends(require_role(UserRole.delivery)), db: Session = Depends(get_db)):
    pickup = db.query(Pickup).filter(Pickup.id == pickup_id, Pickup.delivery_partner_id == current_user.id).first()
    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup not found")
    if pickup.otp_code != otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    pickup.otp_verified = True
    pickup.status = "delivered"
    donation = db.query(Donation).filter(Donation.id == pickup.donation_id).first()
    if donation:
        donation.status = DonationStatus.delivered
    txn = Transaction(
        donation_id=pickup.donation_id,
        from_user_id=donation.business_id if donation else None,
        to_user_id=donation.accepted_by_id if donation else None,
        type="delivery",
        quantity=donation.quantity if donation else None,
        unit=donation.unit if donation else None
    )
    db.add(txn)
    db.commit()
    return {"message": "Delivery confirmed successfully!", "verified": True}

@router.get("/active-deliveries")
def get_active_deliveries(current_user: User = Depends(require_role(UserRole.delivery)), db: Session = Depends(get_db)):
    pickups = db.query(Pickup).filter(
        Pickup.delivery_partner_id == current_user.id,
        Pickup.status.in_(["assigned", "picked"])
    ).all()
    result = []
    for p in pickups:
        donation = db.query(Donation).filter(Donation.id == p.donation_id).first()
        recipient = db.query(User).filter(User.id == donation.accepted_by_id).first() if donation else None
        result.append({
            "pickup_id": p.id,
            "product_name": donation.product_name if donation else "",
            "quantity": donation.quantity if donation else 0,
            "pickup_address": donation.pickup_address if donation else "",
            "recipient_name": recipient.name if recipient else "",
            "recipient_address": recipient.address if recipient else "",
            "recipient_lat": recipient.lat if recipient else None,
            "recipient_lng": recipient.lng if recipient else None,
            "status": p.status,
            "otp_verified": p.otp_verified
        })
    return result

@router.get("/completed-deliveries")
def get_completed_deliveries(current_user: User = Depends(require_role(UserRole.delivery)), db: Session = Depends(get_db)):
    pickups = db.query(Pickup).filter(
        Pickup.delivery_partner_id == current_user.id,
        Pickup.status == "delivered"
    ).order_by(Pickup.created_at.desc()).all()
    result = []
    for p in pickups:
        donation = db.query(Donation).filter(Donation.id == p.donation_id).first()
        result.append({
            "pickup_id": p.id,
            "product_name": donation.product_name if donation else "",
            "quantity": donation.quantity if donation else 0,
            "unit": donation.unit if donation else "",
            "completed_at": p.updated_at or p.created_at,
        })
    return result
