import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///chat_history.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)


SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)


Base = declarative_base()


def create_tables():

    from app.models.user import User
    from app.models.chat_history import ChatHistory
    from app.models.notification import Notification
    from app.models.chat_session import ChatSession

    Base.metadata.create_all(
        bind=engine
    )