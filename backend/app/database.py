"""
SQLAlchemy Database setup and seeder for LAB Notebook.
"""

import logging
from datetime import datetime, date as date_type
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.config import get_settings
from app.models import (
    Base, User, Notification, Project, ProjectMember, ProjectMilestone,
    NotebookFolder, NotebookEntry, NoteAttachment, NoteTable, NoteVersionHistory,
    NoteReference, SharedResource, SharedWithEntry, ResearchPaper, PaperTag,
    AuditLog, CalcHistory
)

logger = logging.getLogger("app.database")
settings = get_settings()

# Create SQLAlchemy engine and session factory
# pool_pre_ping=True checks connection health before executing queries (critical for MySQL reconnects)
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_db(db: Session) -> None:
    """Seed the database with default data if empty."""
    # Check if database is already seeded by checking the User table
    if db.query(User).first() is not None:
        logger.info("Database already seeded. Skipping seeder.")
        return

    logger.info("Database is empty. Seeding initial data...")

    try:
        # 1. User
        user_obj = User(
            id=1,
            name="Dr. Evelyn Thorne",
            role="Principal Investigator",
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            email="evelyn.thorne@labnotebook.ai",
            institution="Institute of Biomolecular Sciences",
            lab="Thorne Genomics Lab",
        )
        db.add(user_obj)

        # 2. Notifications
        seed_notifications = [
            {
                "id": 1,
                "title": "Experiment Approved",
                "message": "Dr. Sarah Connor approved your CRISPR Transfection Log.",
                "time": "10 mins ago",
                "read": False,
                "type": "approval",
            },
            {
                "id": 2,
                "title": "Resource Shared",
                "message": 'Alex Rivera shared folder "Gel Electrophoresis Protocols" with you.',
                "time": "2 hours ago",
                "read": False,
                "type": "share",
            },
            {
                "id": 3,
                "title": "Deadline Approaching",
                "message": 'Milestone "Phase 2 Cell Culturing" is due in 24 hours.',
                "time": "5 hours ago",
                "read": True,
                "type": "warning",
            },
            {
                "id": 4,
                "title": "System Compliance Check",
                "message": "Daily automated 21 CFR Part 11 signature logs successfully compiled.",
                "time": "1 day ago",
                "read": True,
                "type": "info",
            },
        ]
        for n in seed_notifications:
            db.add(Notification(
                id=n["id"],
                title=n["title"],
                message=n["message"],
                time=n["time"],
                read=n["read"],
                type=n["type"]
            ))

        # 3. Projects
        seed_projects = [
            {
                "id": "proj-1",
                "name": "Project Artemis: CRISPR Cell-Line Engineering",
                "code": "PA-CRISPR",
                "description": "Developing high-fidelity CRISPR-Cas9 edits in human dermal fibroblasts for gene therapy modeling.",
                "status": "Active",
                "progress": 68,
                "members": [
                    {"name": "Dr. Evelyn Thorne", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "role": "Lead"},
                    {"name": "Alex Rivera", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "role": "PostDoc"},
                    {"name": "Sarah Connor", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", "role": "Co-Investigator"},
                ],
                "milestones": [
                    {"id": "m1", "name": "sgRNA Design & Synthesis", "completed": True},
                    {"id": "m2", "name": "Transfection efficiency optimization", "completed": True},
                    {"id": "m3", "name": "Western Blot expression verification", "completed": False},
                    {"id": "m4", "name": "Off-target sequencing sequencing assay", "completed": False},
                ],
                "banner": "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800",
                "lastActivity": "2026-06-04T18:30:00Z",
            },
            {
                "id": "proj-2",
                "name": "Project Helios: Biodegradable Polymer Scaffold Synthesis",
                "code": "PH-POLYS",
                "description": "Designing polymer hydrogel scaffolds with varying cross-linking densities for cardiac tissue regeneration.",
                "status": "Active",
                "progress": 45,
                "members": [
                    {"name": "Dr. Evelyn Thorne", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "role": "Lead"},
                    {"name": "Dr. Marcus Vance", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", "role": "Collaborator"},
                ],
                "milestones": [
                    {"id": "h1", "name": "Hydrogel formulation selection", "completed": True},
                    {"id": "h2", "name": "Mechanical tensile stress testing", "completed": False},
                    {"id": "h3", "name": "In-vitro biocompatibility assay", "completed": False},
                ],
                "banner": "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800",
                "lastActivity": "2026-06-03T14:15:00Z",
            },
            {
                "id": "proj-3",
                "name": "Project Hermes: Automated qPCR Diagnostic Pipelines",
                "code": "PH-DIAG",
                "description": "Synthesizing automated primer panels to increase qPCR screening throughput for airborne virus diagnostics.",
                "status": "Planning",
                "progress": 15,
                "members": [
                    {"name": "Dr. Evelyn Thorne", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "role": "Lead"},
                    {"name": "Alex Rivera", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "role": "PostDoc"},
                ],
                "milestones": [
                    {"id": "hm1", "name": "Primer designs in silico", "completed": True},
                    {"id": "hm2", "name": "Synthetic template procurement", "completed": False},
                    {"id": "hm3", "name": "Thermal cycler test runs", "completed": False},
                ],
                "banner": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
                "lastActivity": "2026-06-01T09:00:00Z",
            },
            {
                "id": "proj-4",
                "name": "Project Selene: Amyloid-Beta Plaque Degradation Pathways",
                "code": "PS-NEURO",
                "description": "Elucidating microglial phagocytic clearing mechanisms of oligomeric amyloid-beta plaques in brain organoids.",
                "status": "Completed",
                "progress": 100,
                "members": [
                    {"name": "Dr. Evelyn Thorne", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "role": "Lead"},
                    {"name": "Sarah Connor", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", "role": "Co-Investigator"},
                    {"name": "Dr. Marcus Vance", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", "role": "Collaborator"},
                ],
                "milestones": [
                    {"id": "s1", "name": "Brain organoid growth & validation", "completed": True},
                    {"id": "s2", "name": "Immunohistochemical staining protocol", "completed": True},
                    {"id": "s3", "name": "Confocal microscopy imaging cycles", "completed": True},
                    {"id": "s4", "name": "Paper submission and review", "completed": True},
                ],
                "banner": "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?w=800",
                "lastActivity": "2026-05-20T16:45:00Z",
            },
        ]
        for p in seed_projects:
            # Parse lastActivity to DateTime object
            try:
                last_act = datetime.fromisoformat(p["lastActivity"].replace("Z", "+00:00"))
            except ValueError:
                last_act = datetime.utcnow()

            project_obj = Project(
                id=p["id"],
                name=p["name"],
                code=p["code"],
                description=p["description"],
                status=p["status"],
                progress=p["progress"],
                banner=p["banner"],
                last_activity=last_act
            )
            db.add(project_obj)

            for m in p["members"]:
                db.add(ProjectMember(
                    project_id=p["id"],
                    name=m["name"],
                    avatar=m["avatar"],
                    role=m["role"]
                ))
            for ms in p["milestones"]:
                db.add(ProjectMilestone(
                    id=ms["id"],
                    project_id=p["id"],
                    name=ms["name"],
                    completed=ms["completed"]
                ))

        # 4. Notebook Folders
        seed_folders = [
            {"id": "folder-1", "name": "Genetics & CRISPR Transfections"},
            {"id": "folder-2", "name": "Hydrogel Synthesis Protocols"},
            {"id": "folder-3", "name": "Microscopy & Image Analysis"},
            {"id": "folder-4", "name": "Standard Operating Procedures (SOP)"},
        ]
        for f in seed_folders:
            db.add(NotebookFolder(
                id=f["id"],
                name=f["name"]
            ))

        # 5. Notebook Entries
        seed_entries = [
            {
                "id": "note-1",
                "folderId": "folder-1",
                "projectId": "proj-1",
                "title": "HEK293T Cas9 Transfection Efficiency Assay",
                "status": "In Review",
                "date": "2026-06-04",
                "author": "Dr. Evelyn Thorne",
                "content": (
                    "### Objective\n"
                    "Evaluate the transfection efficiency of Lipofectamine 3000 vs Electroporation for conveying sgRNA-Cas9 plasmids into HEK293T cell cultures.\n\n"
                    "### Protocols & Reagents\n"
                    "1. **HEK293T Cell Lines**: Passaged at 80% confluency, seeded at $2 \\times 10^5$ cells/well in 6-well plate.\n"
                    "2. **Plasmids**: pSpCas9(BB)-2A-GFP (PX458) expressing GFP reporter.\n"
                    "3. **Transfection Method**:\n"
                    "   - Lane A: Lipofectamine 3000 (0.75 µL/well + P3000 reagent)\n"
                    "   - Lane B: Electroporation (1150V, 20ms, 2 pulses)\n\n"
                    "### Execution Log\n"
                    "Cells were incubated for 48 hours at 37°C in 5% CO2 before analysis."
                ),
                "attachments": [
                    {"name": "Flow_Cytometry_Plot_HEK293.pdf", "size": "2.4 MB", "type": "PDF"},
                    {"name": "Fluorescence_Micrograph_Green.png", "size": "4.8 MB", "type": "Image"},
                ],
                "tables": [
                    {
                        "headers": ["Sample ID", "Method", "Total Cells Counted", "GFP Positive Count", "Transfection Efficiency (%)"],
                        "rows": [
                            ["Sample A-1", "Lipofectamine 3000", "10,000", "7,450", "74.5%"],
                            ["Sample A-2", "Lipofectamine 3000", "10,000", "7,210", "72.1%"],
                            ["Sample B-1", "Electroporation", "10,000", "8,920", "89.2%"],
                            ["Sample B-2", "Electroporation", "10,000", "9,110", "91.1%"],
                        ],
                    }
                ],
                "versionHistory": [
                    {"version": "v1.2", "timestamp": "2026-06-04 18:12", "user": "Dr. Evelyn Thorne", "comment": "Added flow cytometry statistics table"},
                    {"version": "v1.1", "timestamp": "2026-06-03 11:05", "user": "Dr. Evelyn Thorne", "comment": "Linked transfection protocol"},
                    {"version": "v1.0", "timestamp": "2026-06-02 09:30", "user": "Alex Rivera", "comment": "Initial setup draft"},
                ],
                "references": [
                    {"citation": "Ran, F.A. et al. Genome engineering using the CRISPR-Cas9 system. Nat Protoc 8, 2281–2308 (2013).", "doi": "10.1038/nprot.2013.143"}
                ],
            },
            {
                "id": "note-2",
                "folderId": "folder-2",
                "projectId": "proj-2",
                "title": "Rheological characterization of PEG-Scaffolds",
                "status": "Approved",
                "date": "2026-06-01",
                "author": "Dr. Evelyn Thorne",
                "content": (
                    "### Objective\n"
                    "Determine the storage modulus (G') and loss modulus (G\") of Polyethylene Glycol (PEG) hydrogel scaffolds crosslinked at 5%, 8%, and 12% nominal concentrations.\n\n"
                    "### Testing Setup\n"
                    "Testing was conducted on a Discovery HR-2 Rheometer using a 20mm parallel plate geometry.\n\n"
                    "### Summary Conclusions\n"
                    "The storage modulus (G') increases exponentially with PEG cross-linking density."
                ),
                "attachments": [{"name": "Rheology_Raw_Data_June1.xlsx", "size": "1.2 MB", "type": "Excel"}],
                "tables": [
                    {
                        "headers": ["PEG Concentration (%)", "Average Storage Modulus G' (Pa)", "Average Loss Modulus G\" (Pa)", "Gelation Time (s)"],
                        "rows": [
                            ["5%", "1,240", "180", "185"],
                            ["8%", "3,890", "420", "124"],
                            ["12%", "8,450", "890", "76"],
                        ],
                    }
                ],
                "versionHistory": [
                    {"version": "v1.0", "timestamp": "2026-06-01 16:30", "user": "Dr. Evelyn Thorne", "comment": "Experiment completed and digitally signed."}
                ],
                "references": [
                    {"citation": "Lutolf, M. P. et al. Synthesis and characterization of PEG-hydrogels. Biomacromolecules 4, 713–722 (2003).", "doi": "10.1021/bm025744e"}
                ],
            },
            {
                "id": "note-3",
                "folderId": "folder-1",
                "projectId": "proj-1",
                "title": "Primer Panel Screening & qPCR Controls validation",
                "status": "Draft",
                "date": "2026-06-05",
                "author": "Alex Rivera",
                "content": (
                    "### Objective\n"
                    "Validate prime efficiency and design proper negative/positive controls for the upcoming qPCR run.\n\n"
                    "### Primer Sequences\n"
                    "- Forward: 5'-GTCCTACGCAGCCTATCG-3'\n"
                    "- Reverse: 5'-TGCTAGCTAGCTGATGTC-3'\n\n"
                    "### Checklist\n"
                    "- [x] Primer reconstitution to 100µM stock\n"
                    "- [x] Prepare dilution standards (10^7 down to 10^2 copies)\n"
                    "- [/] Set up plate layout in 96-well template\n"
                    "- [ ] Add Master Mix and run thermal cycler"
                ),
                "attachments": [],
                "tables": [],
                "versionHistory": [
                    {"version": "v1.0", "timestamp": "2026-06-05 08:20", "user": "Alex Rivera", "comment": "Drafted qPCR control configuration"}
                ],
                "references": [],
            },
        ]
        for e in seed_entries:
            entry_obj = NotebookEntry(
                id=e["id"],
                folder_id=e["folderId"],
                project_id=e["projectId"],
                title=e["title"],
                status=e["status"],
                date=date_type.fromisoformat(e["date"]),
                author=e["author"],
                content=e["content"]
            )
            db.add(entry_obj)

            for att in e["attachments"]:
                db.add(NoteAttachment(
                    entry_id=e["id"],
                    name=att["name"],
                    size=att["size"],
                    type=att["type"]
                ))
            for tbl in e["tables"]:
                db.add(NoteTable(
                    entry_id=e["id"],
                    headers=tbl["headers"],
                    rows=tbl["rows"]
                ))
            for v in e["versionHistory"]:
                db.add(NoteVersionHistory(
                    entry_id=e["id"],
                    version=v["version"],
                    timestamp=v["timestamp"],
                    user=v["user"],
                    comment=v["comment"]
                ))
            for ref in e["references"]:
                db.add(NoteReference(
                    entry_id=e["id"],
                    citation=ref["citation"],
                    doi=ref["doi"]
                ))

        # 6. Shared Resources
        seed_shared_resources = [
            {
                "id": "res-1",
                "name": "Genomics Cell-line Sequencing Folder",
                "type": "Folder",
                "owner": "Dr. Evelyn Thorne",
                "permission": "Owner",
                "sharedWith": ["Alex Rivera (Editor)", "Sarah Connor (Commenter)", "Marcus Vance (Viewer)"],
                "lastModified": "2026-06-04 17:00",
            },
            {
                "id": "res-2",
                "name": "Beckman Coulter Ultracentrifuge X-80",
                "type": "Equipment Log",
                "owner": "Equipment Facility (Shared)",
                "permission": "Editor",
                "sharedWith": ["Thorne Genomics Lab", "Vance Polymer Lab"],
                "lastModified": "2026-06-03 14:00",
            },
            {
                "id": "res-3",
                "name": "Biocompatibility Hydrogel SOP.pdf",
                "type": "File",
                "owner": "Dr. Marcus Vance",
                "permission": "Viewer",
                "sharedWith": ["Dr. Evelyn Thorne", "Institute Review Board"],
                "lastModified": "2026-05-15 10:30",
            },
        ]
        for r in seed_shared_resources:
            res_obj = SharedResource(
                id=r["id"],
                name=r["name"],
                type=r["type"],
                owner=r["owner"],
                permission=r["permission"],
                last_modified=r["lastModified"]
            )
            db.add(res_obj)

            for sw in r["sharedWith"]:
                db.add(SharedWithEntry(
                    resource_id=r["id"],
                    entry=sw
                ))

        # 7. Research Papers
        seed_papers = [
            {
                "id": "paper-1",
                "title": "CRISPR/Cas9-mediated genome editing in human cell lines and organisms",
                "authors": "Ran, F. Ann; Hsu, Patrick D.; Wright, Jason; Agarwala, Vineeta; Scott, David A.; Zhang, Feng",
                "journal": "Nature Protocols",
                "year": "2013",
                "doi": "10.1038/nprot.2013.143",
                "summary": "A definitive protocol outlining sgRNA selection, molecular cloning, vector transfection, and genomic analysis methodologies in mammalians.",
                "tags": ["CRISPR", "Methodology", "Molecular Biology"],
            },
            {
                "id": "paper-2",
                "title": "Biocompatibility and biodistribution of injectable PEG hydrogel scaffolds",
                "authors": "Lutolf, Matthias P.; Hubbell, Jeffrey A.",
                "journal": "Biomacromolecules",
                "year": "2003",
                "doi": "10.1021/bm025744e",
                "summary": "Explores mechanistic degradation pathways of polymer hydrogels and documents cell viability responses across multiple culture settings.",
                "tags": ["Polymers", "Biomaterials", "Hydrogels"],
            },
            {
                "id": "paper-3",
                "title": "Programmable editing of human cellular RNA with CRISPR-Cas13",
                "authors": "Abudayyeh, Omar O.; Gootenberg, Jonathan S. et al.",
                "journal": "Science",
                "year": "2017",
                "doi": "10.1126/science.aaq5056",
                "summary": "Showcases target RNA transcript knockdowns, tracking, and diagnostics utilizing CAS13 nucleases in cells.",
                "tags": ["RNA Editing", "Cas13", "Diagnostics"],
            },
        ]
        for rp in seed_papers:
            paper_obj = ResearchPaper(
                id=rp["id"],
                title=rp["title"],
                authors=rp["authors"],
                journal=rp["journal"],
                year=rp["year"],
                doi=rp["doi"],
                summary=rp["summary"]
            )
            db.add(paper_obj)

            for t in rp["tags"]:
                db.add(PaperTag(
                    paper_id=rp["id"],
                    tag=t
                ))

        # 8. Audit Logs
        seed_audit_logs = [
            {"id": "log-1", "timestamp": "2026-06-04 18:12:35", "user": "Dr. Evelyn Thorne", "action": "Digital Signature Applied", "target": "Note: HEK293T Cas9 Transfection Efficiency Assay", "ip": "192.168.1.144", "status": "Compliant"},
            {"id": "log-2", "timestamp": "2026-06-04 18:10:12", "user": "Dr. Evelyn Thorne", "action": "Edit Table Content", "target": "Note: HEK293T Cas9 Transfection Efficiency Assay", "ip": "192.168.1.144", "status": "Compliant"},
            {"id": "log-3", "timestamp": "2026-06-03 14:15:00", "user": "Dr. Marcus Vance", "action": "Join Project Group", "target": "Project: Project Helios Scaffold Synthesis", "ip": "192.168.1.159", "status": "Compliant"},
            {"id": "log-4", "timestamp": "2026-06-02 09:30:11", "user": "Alex Rivera", "action": "Create Document Draft", "target": "Note: HEK293T Cas9 Transfection Efficiency Assay", "ip": "192.168.1.201", "status": "Compliant"},
        ]
        for al in seed_audit_logs:
            db.add(AuditLog(
                id=al["id"],
                timestamp=al["timestamp"],
                user=al["user"],
                action=al["action"],
                target=al["target"],
                ip=al["ip"],
                status=al["status"]
            ))

        # 9. Calc History
        seed_calc_history = [
            {"id": 1, "type": "Molarity", "formula": "C = n/V", "input": "Mass=5.84g (NaCl), Volume=100mL", "result": "1.0 M NaCl Solution", "date": "June 4, 16:30"},
            {"id": 2, "type": "DNA Copy Number", "formula": "Copies = (ng * 6.022e23) / (length * 1e9 * 660)", "input": "Amount=50ng, Length=4000bp", "result": "1.14 x 10^10 copies", "date": "June 4, 15:45"},
            {"id": 3, "type": "PCR Master Mix", "formula": "xN scaling", "input": "Reactions=10, Vol=50uL each", "result": "Total Taq Mix = 500uL", "date": "June 3, 11:20"},
        ]
        for ch in seed_calc_history:
            db.add(CalcHistory(
                id=ch["id"],
                type=ch["type"],
                formula=ch["formula"],
                input=ch["input"],
                result=ch["result"],
                date=ch["date"]
            ))

        db.commit()
        logger.info("Database seeding successfully completed!")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
