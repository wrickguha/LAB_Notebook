import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(100), nullable=False, default="Principal Investigator")
    institution = Column(String(255), nullable=True)
    lab = Column(String(255), nullable=True)
    avatar = Column(String(500), nullable=True, default="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User id={self.id} email={self.email}>"

    @property
    def name(self) -> str:
        return self.full_name
