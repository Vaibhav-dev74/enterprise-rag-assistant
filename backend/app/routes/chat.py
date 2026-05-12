from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.retriever import retrieve_context
from app.rag.gemini_service import generate_answer

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
async def chat(request: ChatRequest):

    context = retrieve_context(
        request.question
    )

    answer = generate_answer(
        request.question,
        context
    )

    return {
        "question": request.question,
        "answer": answer
    }