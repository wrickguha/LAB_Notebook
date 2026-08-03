from datetime import datetime
from sqlalchemy.orm import Session
from app.models.project import Project, Milestone
from app.schemas.project import ProjectCreate
from app.models.user import User

def list_projects(db: Session):
    projects = db.query(Project).all()
    # Format response fields to match frontend expectations
    result = []
    for p in projects:
        ms_list = [
            {
                "id": m.id,
                "project_id": m.project_id,
                "name": m.name,
                "completed": m.completed
            } for m in p.milestones
        ]
        result.append({
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "description": p.description,
            "status": p.status,
            "progress": p.progress,
            "banner": p.banner,
            "lastActivity": p.last_activity.isoformat() if p.last_activity else None,
            "members": p.members or [],
            "milestones": ms_list
        })
    return result

def create_project(db: Session, project_in: ProjectCreate, current_user: User):
    default_members = [
        {"name": current_user.full_name, "role": current_user.role, "avatar": current_user.avatar}
    ]
    new_proj = Project(
        code=project_in.code,
        name=project_in.name,
        description=project_in.description,
        status=project_in.status or "Active",
        progress=project_in.progress or 0,
        banner=project_in.banner or "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800",
        owner_id=current_user.id,
        members=project_in.members or default_members,
        last_activity=datetime.utcnow()
    )
    db.add(new_proj)
    db.flush()

    if project_in.milestones:
        for idx, m in enumerate(project_in.milestones):
            db_m = Milestone(
                id=f"m-{new_proj.id}-{idx}",
                project_id=new_proj.id,
                name=m.name,
                completed=m.completed or False
            )
            db.add(db_m)

    db.commit()
    db.refresh(new_proj)

    ms_list = [
        {
            "id": m.id,
            "project_id": m.project_id,
            "name": m.name,
            "completed": m.completed
        } for m in new_proj.milestones
    ]
    return {
        "id": new_proj.id,
        "code": new_proj.code,
        "name": new_proj.name,
        "description": new_proj.description,
        "status": new_proj.status,
        "progress": new_proj.progress,
        "banner": new_proj.banner,
        "lastActivity": new_proj.last_activity.isoformat() if new_proj.last_activity else None,
        "members": new_proj.members or [],
        "milestones": ms_list
    }

def toggle_milestone(db: Session, project_id: str, milestone_id: str, current_user: User):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return None

    milestone = db.query(Milestone).filter(Milestone.id == milestone_id, Milestone.project_id == project_id).first()
    if not milestone:
        return None

    milestone.completed = not milestone.completed
    
    total = len(project.milestones)
    completed_count = sum(1 for m in project.milestones if m.completed)
    project.progress = round((completed_count / total) * 100) if total > 0 else 0
    project.last_activity = datetime.utcnow()

    db.commit()
    db.refresh(project)

    ms_list = [
        {
            "id": m.id,
            "project_id": m.project_id,
            "name": m.name,
            "completed": m.completed
        } for m in project.milestones
    ]
    return {
        "id": project.id,
        "code": project.code,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "progress": project.progress,
        "banner": project.banner,
        "lastActivity": project.last_activity.isoformat() if project.last_activity else None,
        "members": project.members or [],
        "milestones": ms_list
    }
