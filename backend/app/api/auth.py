from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.models.models import User, UserRole
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, OTPSend, OTPVerify
from app.services.otp_service import create_otp, verify_otp

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    try:
        user_id = int(payload.get("sub"))
    except (ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token subject")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user

def require_role(*roles: UserRole):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker

@router.post("/register", response_model=dict)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=get_password_hash(user_data.password),
        role=user_data.role,
        organization_name=user_data.organization_name,
        address=user_data.address,
        city=user_data.city,
        state=user_data.state,
        lat=user_data.lat,
        lng=user_data.lng,
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Registration successful", "user_id": user.id}

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email, User.role == credentials.role).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email, password, or role")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account suspended")
    access_token = create_access_token({"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user={"id": user.id, "name": user.name, "email": user.email, "role": user.role.value,
              "organization_name": user.organization_name, "language_pref": user.language_pref}
    )

@router.post("/refresh")
def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    try:
        user_id = int(payload.get("sub"))
    except (ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token subject")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access_token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/send-otp")
def send_otp(data: OTPSend, db: Session = Depends(get_db)):
    otp = create_otp(db, data.phone, data.purpose)
    return {"message": f"OTP sent to {data.phone}", "mock_otp": otp if True else None}

@router.post("/verify-otp")
def verify_otp_endpoint(data: OTPVerify, db: Session = Depends(get_db)):
    success = verify_otp(db, data.phone, data.otp_code, data.purpose)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"message": "OTP verified successfully", "verified": True}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id, "name": current_user.name, "email": current_user.email,
        "role": current_user.role.value, "phone": current_user.phone,
        "organization_name": current_user.organization_name, "address": current_user.address,
        "city": current_user.city, "state": current_user.state,
        "lat": current_user.lat, "lng": current_user.lng,
        "language_pref": current_user.language_pref,
        "profile_image": current_user.profile_image, "is_verified": current_user.is_verified
    }

@router.put("/language")
def update_language(lang: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.language_pref = lang
    db.commit()
    return {"message": "Language updated", "language": lang}
