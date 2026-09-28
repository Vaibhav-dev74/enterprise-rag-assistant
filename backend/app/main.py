import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router
from app.routes.documents import router as documents_router
from app.routes.history import router as history_router
from app.routes.auth import router as auth_router
from app.routes.notifications import router as notifications_router

from app.database.database import create_tables


app = FastAPI(title="Enterprise RAG API", version="2.0.0")


# ================================================
# CORS
# ================================================

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    for origin in cors_origins_env.split(","):
        stripped = origin.strip()
        if stripped and stripped not in allowed_origins:
            allowed_origins.append(stripped)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================================================
# CREATE DATABASE TABLES
# ================================================

create_tables()


# ================================================
# SERVE UPLOADED PDFs
# ================================================

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)


# ================================================
# ROUTES
# ================================================

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(history_router)
app.include_router(auth_router)
app.include_router(notifications_router)


@app.get("/")
def home():

    return {
        "message": "Enterprise RAG Backend Running"
    }