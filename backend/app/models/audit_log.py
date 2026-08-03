from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.db.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, default=lambda: f"audit-{int(datetime.utcnow().timestamp() * 1000)}", index=True)
    action = Column(String(255), nullable=False)
    target = Column(String(500), nullable=False)
    user_name = Column(String(255), nullable=False)
    timestamp = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
