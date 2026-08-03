import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv

load_dotenv()

RAW_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/lab_notebook")

def get_working_engine(db_url: str):
    """
    Tries connecting to the configured database (e.g., MySQL).
    If MySQL server is not running or unreachable, falls back gracefully to SQLite.
    """
    if "mysql" in db_url:
        try:
            # Parse database name from URL to auto-create if missing
            from urllib.parse import urlparse
            parsed = urlparse(db_url)
            db_name = parsed.path.lstrip('/')
            if db_name:
                base_url = db_url.rsplit('/', 1)[0]
                temp_engine = create_engine(
                    base_url,
                    isolation_level="AUTOCOMMIT",
                    connect_args={"connect_timeout": 3}
                )
                with temp_engine.connect() as conn:
                    conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"))
                temp_engine.dispose()

            # Test primary MySQL engine
            test_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=3600,
                connect_args={"connect_timeout": 3}
            )
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print(f"[Database] Connected successfully to MySQL database.")
            return test_engine, db_url
        except Exception as e:
            print(f"[Database Notice] Could not connect to MySQL server ({e}).")
            print(f"[Database] Falling back to zero-config local SQLite database (sqlite:///./lab_notebook.db).")

    # Fallback to SQLite
    sqlite_url = "sqlite:///./lab_notebook.db"
    sqlite_engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False}
    )
    return sqlite_engine, sqlite_url

engine, DATABASE_URL = get_working_engine(RAW_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
