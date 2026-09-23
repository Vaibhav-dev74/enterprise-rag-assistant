from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

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


# =================================================
# RENAME CONVERSATION
# =================================================

class RenameSessionRequest(BaseModel):
    title: str


@router.put("/session/{session_id}/title")
def rename_session(session_id: str, req: RenameSessionRequest):

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

        session.title = req.title.strip()
        db.commit()

        return {
            "message": "Session renamed successfully",
            "session_id": session_id,
            "title": session.title,
        }

    finally:

        db.close()


# =================================================
# FORGET CONTEXT / CLEAR SESSION MESSAGES
# =================================================

@router.delete("/session/{session_id}/messages")
def clear_session_messages(session_id: str):

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

        deleted_count = db.query(ChatHistory).filter(
            ChatHistory.session_id == session_id
        ).delete(
            synchronize_session=False
        )

        db.commit()

        return {
            "message": "Conversation memory cleared successfully",
            "session_id": session_id,
            "deleted_count": deleted_count,
        }

    finally:

        db.close()


# =================================================
# CLEAR ALL CONVERSATIONS FOR A USER
# =================================================

@router.delete("/user/{user_id}/clear")
def clear_all_user_history(user_id: int):

    db = SessionLocal()

    try:

        # Delete all history messages for user
        db.query(ChatHistory).filter(
            ChatHistory.user_id == user_id
        ).delete(
            synchronize_session=False
        )

        # Delete all sessions for user
        deleted_sessions = db.query(ChatSession).filter(
            ChatSession.user_id == user_id
        ).delete(
            synchronize_session=False
        )

        db.commit()

        return {
            "message": "All chat history cleared successfully",
            "user_id": user_id,
            "deleted_sessions": deleted_sessions,
        }

    finally:

        db.close()