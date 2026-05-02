from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text
from app.database import Base

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    location = Column(String(255), nullable=True)
    season = Column(String(50), nullable=True)
    image = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
