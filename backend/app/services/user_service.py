from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserUpdate

def update_user_profile(db: Session, user: User, updates: UserUpdate) -> User:
    if updates.name:
        user.full_name = updates.name
    if updates.full_name:
        user.full_name = updates.full_name
    if updates.email:
        user.email = updates.email
    if updates.role:
        user.role = updates.role
    if updates.institution:
        user.institution = updates.institution
    if updates.lab:
        user.lab = updates.lab
    if updates.avatar:
        user.avatar = updates.avatar

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
