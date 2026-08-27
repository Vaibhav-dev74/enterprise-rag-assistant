from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

import traceback

from sqlalchemy.sql import func


from app.rag.retriever import retrieve_context
from app.rag.ollama_service import stream_answer

from app.history.get_history import get_history

from app.database.database import SessionLocal

from app.models.chat_history import ChatHistory
from app.models.chat_session import ChatSession


router = APIRouter()


# =================================================
# REQUEST MODEL
# =================================================

class ChatRequest(BaseModel):

    user_id: int

    session_id: str

    question: str

    filename: str


# =================================================
# CREATE CHAT TITLE
# =================================================

def create_title(question: str):

    question = question.strip()

    if len(question) <= 50:
        return question

    return question[:50].rsplit(" ", 1)[0] + "..."


# =================================================
# CHAT
# =================================================

@router.post("/chat")
async def chat(request: ChatRequest):

    db = SessionLocal()

    try:

        print("\n========== CHAT REQUEST ==========")

        print(
            "User ID:",
            request.user_id
        )

        print(
            "Session:",
            request.session_id
        )

        print(
            "Document:",
            request.filename
        )


        # =============================================
        # FIND OR CREATE CHAT SESSION
        # =============================================

        chat_session = (
            db.query(ChatSession)
            .filter(
                ChatSession.session_id
                == request.session_id
            )
            .first()
        )


        if not chat_session:

            chat_session = ChatSession(

                user_id=request.user_id,

                session_id=request.session_id,

                title=create_title(
                    request.question
                ),

                document=request.filename,

            )

            db.add(chat_session)

            db.commit()

            db.refresh(chat_session)

            print(
                "New chat session created"
            )


        # =============================================
        # GET PREVIOUS CHAT HISTORY
        # =============================================

        previous_messages = (
            db.query(ChatHistory)
            .filter(
                ChatHistory.session_id
                == request.session_id
            )
            .order_by(
                ChatHistory.timestamp.asc()
            )
            .all()
        )


        history = []

        for message in previous_messages:

            history.append(
                {
                    "question":
                        message.question,

                    "answer":
                        message.answer,
                }
            )


        print(
            "History Loaded:",
            len(history)
        )


        # =============================================
        # RETRIEVE DOCUMENT CONTEXT
        # =============================================

        context, citations = retrieve_context(

            request.question,

            request.filename

        )


        print(
            "\nContext Retrieved"
        )


        # =============================================
        # GENERATE ANSWER
        # =============================================

        stream = stream_answer(

            request.question,

            context,

            history

        )


        answer = ""


        for chunk in stream:

            answer += chunk


        print(
            "\nAnswer Generated"
        )


        # =============================================
        # SAVE CHAT MESSAGE
        # =============================================

        chat_message = ChatHistory(

            user_id=request.user_id,

            session_id=request.session_id,

            question=request.question,

            answer=answer,

            document=request.filename,

        )


        db.add(chat_message)


        # Update conversation
        chat_session.document = request.filename

        chat_session.updated_at = func.now()


        db.commit()


        print(
            "\nChat saved successfully"
        )


        return {

            "answer": answer,

            "sources": citations,

            "session_id":
                request.session_id,

            "session_title":
                chat_session.title,

        }


    except Exception as e:

        db.rollback()

        traceback.print_exc()

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )


    finally:

        db.close()