from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.dependencies import get_current_admin, get_db
from app.models.news import News
from app.schemas.news import NewsCreate, NewsRead, NewsUpdate

router = APIRouter(prefix="/news", tags=["News"])

@router.get("/", response_model=list[NewsRead])
def list_news(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return db.query(News).order_by(News.date.desc()).offset(skip).limit(limit).all()

@router.get("/{news_id}", response_model=NewsRead)
def get_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="News not found")
    return news

@router.post("/", response_model=NewsRead, status_code=status.HTTP_201_CREATED)
def create_news(
    payload: NewsCreate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    news = News(**payload.model_dump())
    db.add(news)
    db.commit()
    db.refresh(news)
    return news

@router.put("/{news_id}", response_model=NewsRead)
def update_news(
    news_id: int,
    payload: NewsUpdate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="News not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(news, key, value)

    db.commit()
    db.refresh(news)
    return news

@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="News not found")
    db.delete(news)
    db.commit()
    return None
