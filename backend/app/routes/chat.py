from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.rag.retriever import retrieve_context
from app.rag.ollama_service import stream_answer
from app.history.chat_history import save_chat
from app.history.get_history import get_history

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str
    question: str
    filename: str


@router.post("/chat")
async def chat(request: ChatRequest):

    # Previous conversation
    history = get_history(request.session_id)

    # Retrieve document context
    context, citations = retrieve_context(
        request.question,
        request.filename
    )

    # Get streaming response from Ollama
    stream = stream_answer(
        request.question,
        context,
        history
    )

    # Generator function
    def generate():

        full_answer = ""

        for chunk in stream:
            full_answer += chunk
            yield chunk

        # Save completed response
        save_chat(
            session_id=request.session_id,
            question=request.question,
            answer=full_answer,
            document=request.filename
        )

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )