from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import require_role
from app.models.models import User, UserRole, Donation, DonationStatus, Pickup, Transaction, Notification
from app.core.security import get_password_hash

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
def admin_dashboard(current_user: User = Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_donations = db.query(Donation).count()
    delivered = db.query(Donation).filter(Donation.status == DonationStatus.delivered).count()
    pending = db.query(Donation).filter(Donation.status == DonationStatus.pending).count()
    businesses = db.query(User).filter(User.role == UserRole.business).count()
    ngos = db.query(User).filter(User.role == UserRole.ngo).count()
    individuals = db.query(User).filter(User.role == UserRole.individual).count()
    delivery_partners = db.query(User).filter(User.role == UserRole.delivery).count()
    all_donations = db.query(Donation).filter(Donation.status == DonationStatus.delivered).all()
    total_food_saved = sum(d.quantity for d in all_donations)
    return {
        "total_users": total_users,
        "businesses": businesses, "ngos": ngos,
        "individuals": individuals, "delivery_partners": delivery_partners,
        "total_donations": total_donations,
        "delivered_donations": delivered,
        "pending_donations": pending,
        "total_food_saved_kg": total_food_saved,
        "co2_saved_kg": total_food_saved * 2.5,
        "delivery_success_rate": round(delivered / total_donations * 100, 2) if total_donations > 0 else 0
    }

@router.get("/users")
def get_users(
    current_user: User = Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
    role: str = None, skip: int = 0, limit: int = 50
):
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    users = q.offset(skip).limit(limit).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role.value,
             "is_active": u.is_active, "is_verified": u.is_verified,
             "organization_name": u.organization_name, "city": u.city, "created_at": u.created_at} for u in users]

@router.put("/users/{user_id}/toggle-active")
def toggle_user_active(user_id: int, current_user: User = Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'suspended'}", "is_active": user.is_active}

@router.get("/donations")
def get_all_donations(current_user: User = Depends(require_role(UserRole.admin)), db: Session = Depends(get_db), status: str = None):
    q = db.query(Donation)
    if status:
        q = q.filter(Donation.status == status)
    donations = q.order_by(Donation.created_at.desc()).limit(100).all()
    return [{"id": d.id, "product_name": d.product_name, "quantity": d.quantity, "unit": d.unit,
             "status": d.status.value, "business_id": d.business_id, "created_at": d.created_at} for d in donations]

@router.get("/deliveries")
def get_all_deliveries(current_user: User = Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    pickups = db.query(Pickup).order_by(Pickup.created_at.desc()).limit(100).all()
    return [{"id": p.id, "donation_id": p.donation_id, "status": p.status,
             "otp_verified": p.otp_verified, "scheduled_time": p.scheduled_time,
             "delivery_partner_id": p.delivery_partner_id, "created_at": p.created_at} for p in pickups]

@router.post("/broadcast-notification")
def broadcast_notification(title: str, message: str, role: str = None,
                           current_user: User = Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    users = q.all()
    for u in users:
        notif = Notification(user_id=u.id, title=title, message=message, type="info")
        db.add(notif)
    db.commit()
    return {"message": f"Notification sent to {len(users)} users"}

@router.get("/notifications")
def get_notifications(current_user: User = Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    return db.query(Notification).order_by(Notification.created_at.desc()).limit(100).all()

@router.get("/reports/system")
def system_reports(current_user: User = Depends(require_role(UserRole.admin)), db: Session = Depends(get_db)):
    all_delivered = db.query(Donation).filter(Donation.status == DonationStatus.delivered).all()
    by_category = {}
    for d in all_delivered:
        cat = d.category or "Uncategorized"
        by_category[cat] = by_category.get(cat, 0) + d.quantity
    return {
        "category_breakdown": by_category,
        "total_transactions": db.query(Transaction).count(),
        "total_pickups": db.query(Pickup).count(),
        "successful_pickups": db.query(Pickup).filter(Pickup.status == "delivered").count(),
    }
