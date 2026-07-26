from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.chat_history import ChatHistory


def get_history(session_id, limit=5):

    db: Session = SessionLocal()

    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.session_id == session_id)
        .order_by(ChatHistory.timestamp.desc())
        .limit(limit)
        .all()
    )

    db.close()

    history = []

    for chat in reversed(chats):

        history.append(
            {
                "question": chat.question,
                "answer": chat.answer,
            }
        )

    return history