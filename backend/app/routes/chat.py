from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import traceback

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

    try:

        print("\n========== CHAT REQUEST ==========")
        print(request)

        history = get_history(request.session_id)

        print("\nHistory Loaded")

        context, citations = retrieve_context(
            request.question,
            request.filename
        )

        print("\nContext Retrieved")
        print(context[:300])

        stream = stream_answer(
            request.question,
            context,
            history
        )

        print("\nLLM Started")

        answer = ""

        for chunk in stream:
            answer += chunk

        print("\nAnswer Generated")

        save_chat(
            session_id=request.session_id,
            question=request.question,
            answer=answer,
            document=request.filename
        )

        print("\nSaved Chat")

        return {
            "answer": answer,
            "sources": citations
        }

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )