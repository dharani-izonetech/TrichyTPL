from fastapi import APIRouter

from app.api import auth, dashboard, media, news, players, teams, matches

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(media.router)
api_router.include_router(news.router)
api_router.include_router(players.router)
api_router.include_router(teams.router)
api_router.include_router(matches.router)
