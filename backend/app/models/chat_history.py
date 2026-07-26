from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(String)

    question = Column(String)

    answer = Column(String)

    document = Column(String)

    timestamp = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )