from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
# Import models to ensure they are registered on Base for table creation
from app.models.user import User
from app.api.auth import router as auth_router

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Lab Notebook API",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Crucial for cookie transmission
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Lab Notebook API is running!"}
