from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from app.db.database import Base

class CalcHistory(Base):
    __tablename__ = "calc_history"

    id = Column(String(50), primary_key=True, default=lambda: f"calc-{int(datetime.utcnow().timestamp() * 1000)}", index=True)
    type = Column(String(100), nullable=False)
    formula = Column(String(255), nullable=True)
    input = Column(String(500), nullable=False)
    result = Column(String(500), nullable=False)
    date = Column(String(100), nullable=True)
    timestamp = Column(String(100), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
