from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from app.db.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(50), primary_key=True, default=lambda: f"notif-{int(datetime.utcnow().timestamp() * 1000)}", index=True)
    message = Column(String(500), nullable=False)
    type = Column(String(50), nullable=False, default="info")
    read = Column(Boolean, nullable=False, default=False)
    timestamp = Column(String(100), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
