from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime
from app.models.models import UserRole, DonationStatus

# ---- Auth Schemas ----
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    role: UserRole
    organization_name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: UserRole

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    role: UserRole
    is_verified: bool
    is_active: bool
    organization_name: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    language_pref: str
    profile_image: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# ---- OTP Schemas ----
class OTPSend(BaseModel):
    phone: str
    purpose: str = "verify_phone"

class OTPVerify(BaseModel):
    phone: str
    otp_code: str
    purpose: str = "verify_phone"

class DeliveryOTPVerify(BaseModel):
    pickup_id: int
    otp_code: str

# ---- Inventory Schemas ----
class InventoryItemCreate(BaseModel):
    barcode: Optional[str] = None
    product_name: str
    category: Optional[str] = None
    quantity: float
    unit: str = "kg"
    expiry_date: Optional[datetime] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class InventoryItemOut(BaseModel):
    id: int
    barcode: Optional[str] = None
    product_name: str
    category: Optional[str] = "General"
    quantity: float = 1.0
    unit: str = "kg"
    expiry_date: Optional[Any] = None
    description: Optional[str] = None
    status: Optional[str] = "available"
    ai_urgency_score: Optional[float] = 0.0
    created_at: Optional[Any] = None
    class Config:
        from_attributes = True

# ---- Donation Schemas ----
class DonationCreate(BaseModel):
    item_id: Optional[int] = None
    product_name: str
    category: Optional[str] = None
    quantity: float
    unit: str = "kg"
    expiry_date: Optional[datetime] = None
    description: Optional[str] = None
    pickup_address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class DonationOut(BaseModel):
    id: int
    product_name: str
    category: Optional[str] = None
    quantity: float
    unit: str = "kg"
    expiry_date: Optional[datetime] = None
    description: Optional[str] = None
    pickup_address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    status: Any
    ai_match_score: float = 0.0
    business_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# ---- Beneficiary Schemas ----
class BeneficiaryCreate(BaseModel):
    name: str
    count: int = 1
    address: Optional[str] = None
    contact: Optional[str] = None
    notes: Optional[str] = None

class BeneficiaryOut(BaseModel):
    id: int
    name: str
    count: int
    address: Optional[str]
    contact: Optional[str]
    notes: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# ---- Pickup Schemas ----
class PickupSchedule(BaseModel):
    donation_id: int
    scheduled_time: datetime
    notes: Optional[str] = None

class PickupOut(BaseModel):
    id: int
    donation_id: int
    scheduled_time: Optional[datetime]
    otp_code: Optional[str]
    otp_verified: bool
    status: str
    created_at: datetime
    class Config:
        from_attributes = True
