from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.user import User

def list_notifications(db: Session, current_user: User | None = None):
    query = db.query(Notification).order_by(Notification.created_at.desc())
    if current_user:
        query = query.filter(Notification.user_id == current_user.id)
    notifications = query.all()
    return [
        {
            "id": n.id,
            "message": n.message,
            "type": n.type,
            "read": n.read,
            "timestamp": n.timestamp
        } for n in notifications
    ]

def mark_notifications_read(db: Session, current_user: User | None = None):
    query = db.query(Notification)
    if current_user:
        query = query.filter(Notification.user_id == current_user.id)
    query.update({"read": True}, synchronize_session=False)
    db.commit()
    return {"success": True}
