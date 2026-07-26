from fastapi import APIRouter, HTTPException

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user import User
from app.schemas.user import RegisterUser, LoginUser

from app.auth.hashing import (
    hash_password,
    verify_password,
)

from app.auth.jwt_handler import create_access_token

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

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    db.close()

    return {
        "message": "User registered successfully"
    }


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