from fastapi import FastAPI
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router
from app.routes.documents import router as documents_router
from app.routes.documents import router as document_router
from app.routes.history import router as history_router
from app.database.database import create_tables

app = FastAPI()

create_tables()

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(document_router)
app.include_router(history_router)

@app.get("/")
def home():
    return {
        "message": "Enterprise RAG Backend Running"
    }