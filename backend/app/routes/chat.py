from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.retriever import retrieve_context
from app.rag.ollama_service import generate_answer
from app.history.chat_history import save_chat

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    filename: str


@router.post("/chat")
async def chat(request: ChatRequest):

    # Retrieve relevant context
    context = retrieve_context(
        request.question,
        request.filename
    )

    # Generate answer
    answer = generate_answer(
        request.question,
        context
    )

    # Save chat history
    save_chat(
        question=request.question,
        answer=answer,
        document=request.filename
    )

    return {
        "question": request.question,
        "filename": request.filename,
        "answer": answer
    }