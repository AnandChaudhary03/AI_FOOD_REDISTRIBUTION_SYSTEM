from app.core.database import SessionLocal, engine, Base
from app.models.models import User, UserRole, InventoryItem, Donation, DonationStatus
from app.core.security import get_password_hash
from datetime import datetime, timedelta

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if seeded
    if db.query(User).first():
        print("Database already seeded.")
        db.close()
        return

    password = get_password_hash("password123")

    # 1. Business User
    biz = User(
        name="Green Harvest Bakery",
        email="business@annasetu.org",
        password_hash=password,
        role=UserRole.business,
        organization_name="Green Harvest Bakery & Cafe",
        address="Connaught Place, Block C, New Delhi",
        lat=28.6315, lng=77.2167,
        is_verified=True
    )

    # 2. NGO User
    ngo = User(
        name="Asha Food Bank",
        email="ngo@annasetu.org",
        password_hash=password,
        role=UserRole.ngo,
        organization_name="Asha Care Foundation",
        address="Lajpat Nagar IV, New Delhi",
        lat=28.5672, lng=77.2433,
        is_verified=True
    )

    # 3. Individual User
    ind = User(
        name="Ramesh Kumar",
        email="individual@annasetu.org",
        password_hash=password,
        role=UserRole.individual,
        address="Karol Bagh, New Delhi",
        lat=28.6514, lng=77.1907,
        is_verified=True
    )

    # 4. Delivery Partner
    deliv = User(
        name="Speedy Deliveries",
        email="delivery@annasetu.org",
        password_hash=password,
        role=UserRole.delivery,
        organization_name="Express Logistics",
        address="Rajiv Chowk, New Delhi",
        lat=28.6328, lng=77.2197,
        is_verified=True
    )

    # 5. Admin User
    admin = User(
        name="System Administrator",
        email="admin@annasetu.org",
        password_hash=password,
        role=UserRole.admin,
        organization_name="AnnaSetu Central",
        address="HQ Complex, New Delhi",
        lat=28.6139, lng=77.2090,
        is_verified=True
    )

    db.add_all([biz, ngo, ind, deliv, admin])
    db.commit()

    # Add sample inventory items
    item1 = InventoryItem(
        business_id=biz.id,
        product_name="Fresh Wheat Bread Loaves",
        category="Bakery",
        quantity=30, unit="packets",
        expiry_date=datetime.utcnow() + timedelta(days=2),
        barcode="8901058000185",
        ai_urgency_score=88.5
    )

    item2 = InventoryItem(
        business_id=biz.id,
        product_name="Pasteurized Milk 1L Packets",
        category="Dairy",
        quantity=50, unit="litre",
        expiry_date=datetime.utcnow() + timedelta(days=5),
        barcode="8901262010012",
        ai_urgency_score=65.0
    )

    db.add_all([item1, item2])
    db.commit()

    # Add sample donation
    donation = Donation(
        business_id=biz.id,
        item_id=item1.id,
        product_name="Fresh Wheat Bread Loaves",
        category="Bakery",
        quantity=20, unit="packets",
        expiry_date=datetime.utcnow() + timedelta(days=2),
        pickup_address="Connaught Place, Block C, New Delhi",
        lat=28.6315, lng=77.2167,
        status=DonationStatus.pending,
        ai_match_score=92.0
    )
    db.add(donation)
    db.commit()

    print("Sample database successfully seeded!")
    db.close()

if __name__ == "__main__":
    seed_db()
