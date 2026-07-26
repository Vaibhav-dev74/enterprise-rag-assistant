from fastapi import APIRouter

from app.history.chat_history import get_chat_history

router = APIRouter()


@router.get("/history/{session_id}")
def history(session_id: str):

    chats = get_chat_history()

    history = []

    for chat in chats:

        if chat.session_id == session_id:

            history.append(
                {
                    "question": chat.question,
                    "answer": chat.answer,
                    "document": chat.document,
                    "timestamp": chat.timestamp,
                }
            )

    return {
        "history": history
    }