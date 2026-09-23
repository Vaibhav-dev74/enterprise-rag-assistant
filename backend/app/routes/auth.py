from fastapi import APIRouter, HTTPException

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user import User
from app.schemas.user import (
    RegisterUser,
    LoginUser,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UpdateProfileRequest,
    ChangePasswordRequest,
    VerifyEmailRequest,
    ResendVerificationRequest,
)

from app.auth.hashing import (
    hash_password,
    verify_password,
)

from app.auth.jwt_handler import create_access_token
from app.notifications.notification_service import create_notification
import random

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(user: RegisterUser):

    db: Session = SessionLocal()

    existing = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing:

        db.close()

        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    # Generate 6-digit email verification code
    verification_code = str(random.randint(100000, 999999))

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        is_verified=False,
        verification_code=verification_code,
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    print(f"\n[AUTH] New User Registered: {user.email}")
    print(f"[AUTH] Email Verification Code: {verification_code}\n")

    db.close()

    return {
        "message": "User registered successfully! Please verify your email before logging in.",
        "email": user.email,
        "verification_code": verification_code,
        "requires_verification": True,
    }


@router.post("/verify-email")
def verify_email(req: VerifyEmailRequest):
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="No account found with this email.",
            )

        if user.is_verified:
            return {
                "message": "Email is already verified. You can now log in.",
                "verified": True,
            }

        if not user.verification_code or user.verification_code != req.code.strip():
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired verification code. Please check and try again.",
            )

        user.is_verified = True
        user.verification_code = None
        db.commit()

        create_notification(
            user_id=user.id,
            title="Email Verified",
            message="Your email address has been verified successfully. Welcome to Enterprise RAG!",
            notification_type="security",
        )

        return {
            "message": "Email verified successfully! You can now log in.",
            "verified": True,
        }
    finally:
        db.close()


@router.post("/resend-verification")
def resend_verification(req: ResendVerificationRequest):
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="No account found with this email.",
            )

        if user.is_verified:
            return {
                "message": "Email is already verified. You can log in.",
                "verified": True,
            }

        new_code = str(random.randint(100000, 999999))
        user.verification_code = new_code
        db.commit()

        print(f"\n[AUTH] Resent Verification Code for {user.email}: {new_code}\n")

        return {
            "message": "Verification code resent successfully.",
            "verification_code": new_code,
        }
    finally:
        db.close()


@router.post("/login")
def login(user: LoginUser):

    db: Session = SessionLocal()

    existing = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing:

        db.close()

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        user.password,
        existing.password,
    ):

        db.close()

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not existing.is_verified:
        if not existing.verification_code:
            existing.verification_code = str(random.randint(100000, 999999))
            db.commit()
        db.close()
        raise HTTPException(
            status_code=403,
            detail="Email is not verified. Please verify your email before logging in.",
        )

    token = create_access_token(
        {
            "user_id": existing.id,
            "email": existing.email,
        }
    )

    db.close()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": existing.id,
            "name": existing.name,
            "email": existing.email,
        },
    }


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if not user:
            # Return 404 or a friendly message
            raise HTTPException(
                status_code=404,
                detail="No account registered with this email address.",
            )

        # Generate a 6-digit numeric reset token
        reset_code = f"{random.randint(100000, 999999)}"
        user.reset_token = reset_code
        db.commit()

        # Create system notification for user
        try:
            create_notification(
                user_id=user.id,
                title="Password Reset Requested",
                message=f"A password reset request was initiated for your account. Code: {reset_code}",
                notification_type="security",
            )
        except Exception:
            pass

        return {
            "message": "Password reset code generated successfully.",
            "email": user.email,
            "reset_code": reset_code,
        }
    finally:
        db.close()


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="Account not found.",
            )

        # Verify token
        if not user.reset_token or user.reset_token != req.token.strip():
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired reset code. Please request a new code.",
            )

        if len(req.new_password) < 6:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 6 characters long.",
            )

        user.password = hash_password(req.new_password)
        user.reset_token = None
        db.commit()

        # Notification
        try:
            create_notification(
                user_id=user.id,
                title="Password Changed",
                message="Your account password was successfully reset.",
                notification_type="security",
            )
        except Exception:
            pass

        return {
            "message": "Password reset successful! You can now log in with your new password.",
        }
    finally:
        db.close()


@router.put("/profile")
def update_profile(req: UpdateProfileRequest):
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.id == req.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if email is already taken by another user
        if req.email != user.email:
            existing = db.query(User).filter(User.email == req.email, User.id != req.user_id).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email is already in use by another account.")
            user.email = req.email

        user.name = req.name.strip()
        db.commit()
        db.refresh(user)

        try:
            create_notification(
                user_id=user.id,
                title="Profile Updated",
                message="Your profile details have been updated successfully.",
                notification_type="profile",
            )
        except Exception:
            pass

        return {
            "message": "Profile updated successfully.",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
            },
        }
    finally:
        db.close()


@router.put("/change-password")
def change_password(req: ChangePasswordRequest):
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.id == req.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if not verify_password(req.current_password, user.password):
            raise HTTPException(
                status_code=400,
                detail="Incorrect current password.",
            )

        if len(req.new_password) < 6:
            raise HTTPException(
                status_code=400,
                detail="New password must be at least 6 characters long.",
            )

        user.password = hash_password(req.new_password)
        db.commit()

        try:
            create_notification(
                user_id=user.id,
                title="Security Alert",
                message="Your password was successfully changed from your account settings.",
                notification_type="security",
            )
        except Exception:
            pass

        return {
            "message": "Password changed successfully.",
        }
    finally:
        db.close()