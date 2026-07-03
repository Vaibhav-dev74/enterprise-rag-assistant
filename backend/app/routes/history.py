from fastapi import APIRouter

from app.history.chat_history import get_chat_history

router = APIRouter()


@router.get("/history")
def history():

    return {
        "history": get_chat_history()
    }