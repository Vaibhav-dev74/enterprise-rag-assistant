from fastapi import APIRouter, HTTPException

from app.database.database import SessionLocal
from app.models.notification import Notification


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/{user_id}")
def get_notifications(user_id: int):

    db = SessionLocal()

    try:

        notifications = (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id
            )
            .order_by(
                Notification.id.desc()
            )
            .all()
        )

        return {
            "notifications": [
                {
                    "id": notification.id,
                    "title": notification.title,
                    "message": notification.message,
                    "type": notification.type,
                    "is_read": notification.is_read,
                    "created_at": notification.created_at,
                }
                for notification in notifications
            ]
        }

    finally:

        db.close()


@router.get("/{user_id}/unread-count")
def unread_count(user_id: int):

    db = SessionLocal()

    try:

        count = (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
            .count()
        )

        return {
            "count": count
        }

    finally:

        db.close()


@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int):

    db = SessionLocal()

    try:

        notification = (
            db.query(Notification)
            .filter(
                Notification.id == notification_id
            )
            .first()
        )

        if not notification:

            raise HTTPException(
                status_code=404,
                detail="Notification not found"
            )

        notification.is_read = True

        db.commit()

        return {
            "message": "Notification marked as read"
        }

    finally:

        db.close()


@router.put("/{user_id}/read-all")
def mark_all_as_read(user_id: int):

    db = SessionLocal()

    try:

        db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update(
            {
                Notification.is_read: True
            }
        )

        db.commit()

        return {
            "message": "All notifications marked as read"
        }

    finally:

        db.close()


@router.delete("/{notification_id}")
def delete_notification(notification_id: int):

    db = SessionLocal()

    try:

        notification = (
            db.query(Notification)
            .filter(
                Notification.id == notification_id
            )
            .first()
        )

        if not notification:

            raise HTTPException(
                status_code=404,
                detail="Notification not found"
            )

        db.delete(notification)

        db.commit()

        return {
            "message": "Notification deleted"
        }

    finally:

        db.close()