from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.chat_history import ChatHistory


def save_chat(session_id, question, answer, document):

    db: Session = SessionLocal()

    chat = ChatHistory(
        session_id=session_id,
        question=question,
        answer=answer,
        document=document,
    )

    db.add(chat)
    db.commit()
    db.close()


def get_chat_history(session_id=None):

    db: Session = SessionLocal()

    query = db.query(ChatHistory)

    if session_id:
        query = query.filter(ChatHistory.session_id == session_id)

    chats = query.order_by(ChatHistory.id.asc()).all()

    db.close()

    return chats