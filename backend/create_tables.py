from app.database import engine, Base
from app.models.news import News
from app.models.team import Team
from app.models.player import Player
from app.models.match import Match
from app.models.admin import AdminUser
from app.models.media import MediaAsset, LiveStreamConfig

print("Recreating all tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")
