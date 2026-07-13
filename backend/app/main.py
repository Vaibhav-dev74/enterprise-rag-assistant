from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router
from app.routes.documents import router as documents_router
from app.routes.history import router as history_router

from app.database.database import create_tables

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
create_tables()

# Serve uploaded PDFs
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# Routes
app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(history_router)


@app.get("/")
def home():
    return {
        "message": "Enterprise RAG Backend Running"
    }