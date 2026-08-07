import random
import string
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import OTPToken
from app.core.config import settings

def generate_otp(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))

def create_otp(db: Session, phone: str, purpose: str, user_id: int = None) -> str:
    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    # Invalidate old OTPs
    db.query(OTPToken).filter(
        OTPToken.phone == phone,
        OTPToken.purpose == purpose,
        OTPToken.is_used == False
    ).update({"is_used": True})
    otp = OTPToken(
        user_id=user_id,
        phone=phone,
        otp_code=otp_code,
        purpose=purpose,
        expires_at=expires_at
    )
    db.add(otp)
    db.commit()
    if settings.OTP_MOCK_MODE:
        print(f"\n{'='*40}")
        print(f"[MOCK OTP] Phone: {phone} | Purpose: {purpose} | OTP: {otp_code}")
        print(f"{'='*40}\n")
    else:
        _send_sms(phone, otp_code)
    return otp_code

def verify_otp(db: Session, phone: str, otp_code: str, purpose: str) -> bool:
    now = datetime.utcnow()
    otp = db.query(OTPToken).filter(
        OTPToken.phone == phone,
        OTPToken.otp_code == otp_code,
        OTPToken.purpose == purpose,
        OTPToken.is_used == False,
        OTPToken.expires_at > now
    ).first()
    if otp:
        otp.is_used = True
        db.commit()
        return True
    return False

def _send_sms(phone: str, otp_code: str):
    try:
        from twilio.rest import Client
        from app.core.config import settings
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=f"Your AnnaSetu OTP is: {otp_code}. Valid for {settings.OTP_EXPIRE_MINUTES} minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone
        )
    except Exception as e:
        print(f"SMS failed: {e}")
