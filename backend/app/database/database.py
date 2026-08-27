from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


DATABASE_URL = "sqlite:///chat_history.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
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
    from app.models.chat_session import ChatSession
    from app.models.notification import Notification

    Base.metadata.create_all(
        bind=engine
    )