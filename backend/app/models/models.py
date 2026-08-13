from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Enum, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    business = "business"
    ngo = "ngo"
    individual = "individual"
    delivery = "delivery"
    admin = "admin"

class DonationStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    pickup_scheduled = "pickup_scheduled"
    in_transit = "in_transit"
    delivered = "delivered"
    cancelled = "cancelled"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    organization_name = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    language_pref = Column(String(10), default="en")
    profile_image = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    inventory_items = relationship("InventoryItem", back_populates="business", foreign_keys="InventoryItem.business_id")
    donations = relationship("Donation", back_populates="business", foreign_keys="Donation.business_id")

class OTPToken(Base):
    __tablename__ = "otp_tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    phone = Column(String(20), nullable=True)
    otp_code = Column(String(6), nullable=False)
    purpose = Column(String(50), nullable=False)  # verify_phone, delivery_confirm
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    barcode = Column(String(100), nullable=True, index=True)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    quantity = Column(Float, nullable=False, default=0)
    unit = Column(String(50), default="kg")
    expiry_date = Column(DateTime, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="available")  # available, donated, expired
    ai_urgency_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    business = relationship("User", back_populates="inventory_items", foreign_keys=[business_id])
    donations = relationship("Donation", back_populates="item")

class Donation(Base):
    __tablename__ = "donations"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=True)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), default="kg")
    expiry_date = Column(DateTime, nullable=True)
    description = Column(Text, nullable=True)
    pickup_address = Column(Text, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    status = Column(Enum(DonationStatus), default=DonationStatus.pending)
    accepted_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    delivery_partner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ai_match_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    business = relationship("User", back_populates="donations", foreign_keys=[business_id])
    item = relationship("InventoryItem", back_populates="donations")
    accepted_by = relationship("User", foreign_keys=[accepted_by_id])
    delivery_partner = relationship("User", foreign_keys=[delivery_partner_id])
    pickup = relationship("Pickup", back_populates="donation", uselist=False)

class Pickup(Base):
    __tablename__ = "pickups"
    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.id"), nullable=False)
    delivery_partner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    scheduled_time = Column(DateTime, nullable=True)
    otp_code = Column(String(6), nullable=True)
    otp_verified = Column(Boolean, default=False)
    status = Column(String(50), default="pending")  # pending, assigned, picked, delivered
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    donation = relationship("Donation", back_populates="pickup")
    delivery_partner = relationship("User", foreign_keys=[delivery_partner_id])

class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    count = Column(Integer, default=1)
    address = Column(Text, nullable=True)
    contact = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info")  # info, warning, success, error
    is_read = Column(Boolean, default=False)
    data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.id"), nullable=True)
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    type = Column(String(50), nullable=False)  # donation, pickup, delivery
    quantity = Column(Float, nullable=True)
    unit = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class POSApiKey(Base):
    __tablename__ = "pos_api_keys"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)  # e.g. "Square POS Main Store"
    api_key = Column(String(255), unique=True, index=True, nullable=False)
    pos_provider = Column(String(100), default="Custom POS")  # Square, Toast, Clover, Custom
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class POSLog(Base):
    __tablename__ = "pos_logs"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    api_key_id = Column(Integer, ForeignKey("pos_api_keys.id"), nullable=True)
    pos_provider = Column(String(100), default="Custom POS")
    event_type = Column(String(100), nullable=False)  # sync_sale, sync_inventory, webhook
    items_synced = Column(Integer, default=0)
    details = Column(Text, nullable=True)
    status = Column(String(50), default="success")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
