from datetime import datetime
from pydantic import BaseModel, ConfigDict

class NewsBase(BaseModel):
    title: str
    content: str
    location: str | None = None
    season: str | None = None
    image: str | None = None
    video_url: str | None = None
    date: datetime | None = None

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    location: str | None = None
    season: str | None = None
    image: str | None = None
    video_url: str | None = None
    date: datetime | None = None

class NewsRead(NewsBase):
    id: int
    date: datetime
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
