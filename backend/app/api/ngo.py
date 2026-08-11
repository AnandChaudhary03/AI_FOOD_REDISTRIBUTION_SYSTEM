from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.auth import get_current_user, require_role
from app.models.models import User, UserRole, Donation, DonationStatus, Pickup, Beneficiary, Transaction, Notification
from app.schemas.schemas import BeneficiaryCreate, BeneficiaryOut, PickupSchedule
from app.services.ai_service import calculate_match_score, haversine_distance
from app.services.otp_service import create_otp
from datetime import datetime
import random, string

router = APIRouter(prefix="/ngo", tags=["NGO"])

@router.get("/dashboard")
def get_dashboard(current_user: User = Depends(require_role(UserRole.ngo, UserRole.individual)), db: Session = Depends(get_db)):
    accepted = db.query(Donation).filter(Donation.accepted_by_id == current_user.id).all()
    delivered = [d for d in accepted if d.status == DonationStatus.delivered]
    in_transit = [d for d in accepted if d.status == DonationStatus.in_transit]
    beneficiaries = db.query(Beneficiary).filter(Beneficiary.ngo_id == current_user.id).all()
    total_beneficiaries = sum(b.count for b in beneficiaries)
    total_food = sum(d.quantity for d in delivered)
    return {
        "total_accepted": len(accepted),
        "total_delivered": len(delivered),
        "in_transit_count": len(in_transit),
        "total_beneficiaries": total_beneficiaries,
        "food_received_kg": total_food,
        "pending_pickups": len([d for d in accepted if d.status == DonationStatus.pickup_scheduled]),
    }

@router.get("/available-donations")
def get_available_donations(
    current_user: User = Depends(require_role(UserRole.ngo, UserRole.individual)),
    db: Session = Depends(get_db),
    radius_km: float = 100
):
    donations = db.query(Donation).filter(Donation.status == DonationStatus.pending).all()
    result = []
    for d in donations:
        dist = None
        if current_user.lat and current_user.lng and d.lat and d.lng:
            try:
                dist = haversine_distance(current_user.lat, current_user.lng, d.lat, d.lng)
                if dist > radius_km:
                    continue
            except:
                dist = None
        business = db.query(User).filter(User.id == d.business_id).first()
        biz_name = "AnnaSetu Donor"
        if business:
            biz_name = business.organization_name or business.name or "AnnaSetu Donor"
        result.append({
            "id": d.id, "product_name": d.product_name, "category": d.category or "General",
            "quantity": d.quantity, "unit": d.unit or "kg",
            "expiry_date": d.expiry_date.strftime("%Y-%m-%d") if (d.expiry_date and hasattr(d.expiry_date, 'strftime')) else str(d.expiry_date or ''),
            "description": d.description, "pickup_address": d.pickup_address or "Pickup Address Provided",
            "lat": d.lat, "lng": d.lng, "distance_km": dist,
            "ai_match_score": calculate_match_score(d.quantity),
            "business_name": biz_name,
            "created_at": d.created_at.strftime("%Y-%m-%d %H:%M") if (d.created_at and hasattr(d.created_at, 'strftime')) else str(d.created_at or '')
        })
    return sorted(result, key=lambda x: x["ai_match_score"], reverse=True)

@router.post("/donations/{donation_id}/accept")
def accept_donation(
    donation_id: int,
    current_user: User = Depends(require_role(UserRole.ngo, UserRole.individual)),
    db: Session = Depends(get_db)
):
    donation = db.query(Donation).filter(Donation.id == donation_id, Donation.status == DonationStatus.pending).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found or already accepted")
    donation.status = DonationStatus.accepted
    donation.accepted_by_id = current_user.id
    db.commit()
    notif = Notification(user_id=donation.business_id, title="Donation Accepted",
                         message=f"{current_user.organization_name or current_user.name} accepted your donation of {donation.quantity}{donation.unit} {donation.product_name}",
                         type="success")
    db.add(notif)
    db.commit()
    return {"message": "Donation accepted successfully"}

@router.post("/donations/{donation_id}/schedule-pickup")
def schedule_pickup(
    donation_id: int,
    schedule: PickupSchedule,
    current_user: User = Depends(require_role(UserRole.ngo, UserRole.individual)),
    db: Session = Depends(get_db)
):
    donation = db.query(Donation).filter(Donation.id == donation_id, Donation.accepted_by_id == current_user.id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    otp_code = ''.join(random.choices(string.digits, k=6))
    pickup = Pickup(
        donation_id=donation_id,
        scheduled_time=schedule.scheduled_time,
        otp_code=otp_code,
        notes=schedule.notes
    )
    db.add(pickup)
    donation.status = DonationStatus.pickup_scheduled
    db.commit()
    return {"message": "Pickup scheduled", "otp_code": otp_code, "scheduled_time": schedule.scheduled_time}

@router.get("/accepted-donations")
def get_accepted_donations(current_user: User = Depends(require_role(UserRole.ngo, UserRole.individual)), db: Session = Depends(get_db)):
    donations = db.query(Donation).filter(
        Donation.accepted_by_id == current_user.id,
        Donation.status.in_([DonationStatus.accepted, DonationStatus.pickup_scheduled, DonationStatus.in_transit])
    ).all()
    return [{
        "id": d.id,
        "product_name": d.product_name,
        "quantity": d.quantity,
        "unit": d.unit or "kg",
        "status": d.status.value if hasattr(d.status, 'value') else str(d.status),
        "pickup_address": d.pickup_address or "Pickup Address Provided",
        "created_at": d.created_at.strftime("%Y-%m-%d %H:%M") if (d.created_at and hasattr(d.created_at, 'strftime')) else str(d.created_at or '')
    } for d in donations]

@router.get("/pickup-schedule")
def get_pickup_schedule(current_user: User = Depends(require_role(UserRole.ngo, UserRole.individual)), db: Session = Depends(get_db)):
    accepted_donations = db.query(Donation).filter(Donation.accepted_by_id == current_user.id).all()
    donation_ids = [d.id for d in accepted_donations]
    pickups = db.query(Pickup).filter(Pickup.donation_id.in_(donation_ids)).all()
    result = []
    for p in pickups:
        donation = db.query(Donation).filter(Donation.id == p.donation_id).first()
        result.append({
            "pickup_id": p.id, "donation_id": p.donation_id,
            "product_name": donation.product_name if donation else "",
            "quantity": donation.quantity if donation else 0,
            "unit": donation.unit if donation else "",
            "scheduled_time": p.scheduled_time, "status": p.status,
            "otp_verified": p.otp_verified
        })
    return result

@router.get("/donation-history")
def get_donation_history(current_user: User = Depends(require_role(UserRole.ngo, UserRole.individual)), db: Session = Depends(get_db)):
    donations = db.query(Donation).filter(
        Donation.accepted_by_id == current_user.id,
        Donation.status == DonationStatus.delivered
    ).order_by(Donation.created_at.desc()).all()
    return [{"id": d.id, "product_name": d.product_name, "quantity": d.quantity, "unit": d.unit,
             "created_at": d.created_at, "pickup_address": d.pickup_address} for d in donations]

@router.get("/beneficiaries", response_model=List[BeneficiaryOut])
def get_beneficiaries(current_user: User = Depends(require_role(UserRole.ngo)), db: Session = Depends(get_db)):
    return db.query(Beneficiary).filter(Beneficiary.ngo_id == current_user.id).all()

@router.post("/beneficiaries", response_model=BeneficiaryOut)
def add_beneficiary(data: BeneficiaryCreate, current_user: User = Depends(require_role(UserRole.ngo)), db: Session = Depends(get_db)):
    b = Beneficiary(ngo_id=current_user.id, **data.dict())
    db.add(b)
    db.commit()
    db.refresh(b)
    return b

@router.delete("/beneficiaries/{b_id}")
def delete_beneficiary(b_id: int, current_user: User = Depends(require_role(UserRole.ngo)), db: Session = Depends(get_db)):
    b = db.query(Beneficiary).filter(Beneficiary.id == b_id, Beneficiary.ngo_id == current_user.id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(b)
    db.commit()
    return {"message": "Deleted"}

@router.get("/reports")
def get_reports(current_user: User = Depends(require_role(UserRole.ngo, UserRole.individual)), db: Session = Depends(get_db)):
    delivered = db.query(Donation).filter(Donation.accepted_by_id == current_user.id, Donation.status == DonationStatus.delivered).all()
    beneficiaries = db.query(Beneficiary).filter(Beneficiary.ngo_id == current_user.id).all()
    return {
        "total_donations_received": len(delivered),
        "total_food_kg": sum(d.quantity for d in delivered),
        "total_beneficiaries": sum(b.count for b in beneficiaries),
        "monthly_breakdown": [],
        "category_breakdown": {}
    }
