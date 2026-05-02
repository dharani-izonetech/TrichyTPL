from sqlalchemy import text
from app.database import engine
from app.models.news import News

print("Dropping news table...")
with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS news CASCADE"))
    conn.commit()
print("Table dropped successfully.")
