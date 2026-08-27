from fastapi import APIRouter, HTTPException

from app.database.database import SessionLocal
from app.models.chat_history import ChatHistory
from app.models.chat_session import ChatSession


router = APIRouter(
    prefix="/history",
    tags=["Chat History"]
)


# =================================================
# GET ALL CONVERSATIONS FOR A USER
# =================================================

@router.get("/user/{user_id}")
def get_user_sessions(user_id: int):

    db = SessionLocal()

    try:

        sessions = (
            db.query(ChatSession)
            .filter(
                ChatSession.user_id == user_id
            )
            .order_by(
                ChatSession.updated_at.desc()
            )
            .all()
        )

        return {
            "sessions": [
                {
                    "id": session.id,
                    "session_id": session.session_id,
                    "title": session.title,
                    "document": session.document,
                    "created_at": session.created_at,
                    "updated_at": session.updated_at,
                }
                for session in sessions
            ]
        }

    finally:

        db.close()


# =================================================
# GET MESSAGES FROM ONE CONVERSATION
# =================================================

@router.get("/session/{session_id}")
def get_session_history(session_id: str):

    db = SessionLocal()

    try:

        session = (
            db.query(ChatSession)
            .filter(
                ChatSession.session_id == session_id
            )
            .first()
        )

        if not session:

            raise HTTPException(
                status_code=404,
                detail="Chat session not found"
            )

        messages = (
            db.query(ChatHistory)
            .filter(
                ChatHistory.session_id == session_id
            )
            .order_by(
                ChatHistory.timestamp.asc()
            )
            .all()
        )

        return {
            "session": {
                "id": session.id,
                "session_id": session.session_id,
                "title": session.title,
                "document": session.document,
                "created_at": session.created_at,
                "updated_at": session.updated_at,
            },

            "messages": [
                {
                    "id": message.id,
                    "question": message.question,
                    "answer": message.answer,
                    "document": message.document,
                    "timestamp": message.timestamp,
                }
                for message in messages
            ]
        }

    finally:

        db.close()


# =================================================
# DELETE CONVERSATION
# =================================================

@router.delete("/session/{session_id}")
def delete_session(session_id: str):

    db = SessionLocal()

    try:

        session = (
            db.query(ChatSession)
            .filter(
                ChatSession.session_id == session_id
            )
            .first()
        )

        if not session:

            raise HTTPException(
                status_code=404,
                detail="Chat session not found"
            )

        # Delete all messages first
        db.query(ChatHistory).filter(
            ChatHistory.session_id == session_id
        ).delete(
            synchronize_session=False
        )

        # Delete conversation
        db.delete(session)

        db.commit()

        return {
            "message": "Conversation deleted successfully"
        }

    finally:

        db.close()