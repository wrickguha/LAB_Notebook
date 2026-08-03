from sqlalchemy.orm import Session
from app.db.database import engine, Base
from app.models.user import User
from app.models.project import Project, Milestone
from app.models.notebook import NotebookFolder, NotebookEntry, EntryVersion
from app.models.resource import SharedResource
from app.models.paper import ResearchPaper
from app.models.audit_log import AuditLog
from app.models.calculator import CalcHistory
from app.models.notification import Notification
from app.core.security import hash_password

def init_db(db: Session) -> None:
    # Create all tables first
    Base.metadata.create_all(bind=engine)

    # Check if data already seeded
    if db.query(User).first() is not None:
        print("[Database Init] Database already contains records. Skipping seed.")
        return

    print("[Database Init] Seeding MySQL database with initial BioTech data...")

    # 1. Create Default User
    default_user = User(
        id="user-default-1",
        email="evelyn.thorne@labnotebook.ai",
        hashed_password=hash_password("password123"),
        full_name="Dr. Evelyn Thorne",
        role="Principal Investigator",
        institution="Institute of Biomolecular Sciences",
        lab="Thorne Genomics Lab",
        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    )
    db.add(default_user)
    db.commit()

    # 2. Create Default Projects and Milestones
    proj1 = Project(
        id="proj-1",
        code="PA-CRISPR",
        name="Project Artemis: CRISPR Engineering",
        description="sgRNA design, transfection assay targeting cell line vectors, validation via gel electrophoresis and Western blot.",
        status="Active",
        progress=68,
        banner="https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800",
        owner_id=default_user.id,
        members=[
            {"name": "Dr. Evelyn Thorne", "role": "Principal Investigator", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"},
            {"name": "Dr. Alex Rivera", "role": "Postdoctoral Researcher", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
        ]
    )
    m1_1 = Milestone(id="m1-1", project_id="proj-1", name="sgRNA synthesis & purification", completed=True)
    m1_2 = Milestone(id="m1-2", project_id="proj-1", name="Flow cytometry transfection screening", completed=True)
    m1_3 = Milestone(id="m1-3", project_id="proj-1", name="Western Blot analysis confirmation", completed=False)

    proj2 = Project(
        id="proj-2",
        code="PH-HYDRO",
        name="Project Helios: Scaffold Hydrogels",
        description="Synthesizing cross-linked polyacrylamide/gelatin networks for tissue scaffolds, testing tensile yield points.",
        status="Planning",
        progress=25,
        banner="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800",
        owner_id=default_user.id,
        members=[
            {"name": "Dr. Evelyn Thorne", "role": "Principal Investigator", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
        ]
    )
    m2_1 = Milestone(id="m2-1", project_id="proj-2", name="Polymer cross-linking formulation", completed=True)
    m2_2 = Milestone(id="m2-2", project_id="proj-2", name="Elastic modulus tensile stress profiling", completed=False)
    m2_3 = Milestone(id="m2-3", project_id="proj-2", name="Biocompatibility assay with cell line HEK293T", completed=False)

    db.add_all([proj1, proj2, m1_1, m1_2, m1_3, m2_1, m2_2, m2_3])
    db.commit()

    # 3. Create Default Notebook Folders and Entries
    f1 = NotebookFolder(id="folder-1", name="CRISPR & Genetics", user_id=default_user.id)
    f2 = NotebookFolder(id="folder-2", name="Scaffold Polymers", user_id=default_user.id)
    f3 = NotebookFolder(id="folder-3", name="Lab SOPs", user_id=default_user.id)
    db.add_all([f1, f2, f3])
    db.commit()

    n1 = NotebookEntry(
        id="note-1",
        folder_id="folder-1",
        project_id="proj-1",
        user_id=default_user.id,
        title="HEK293T Transfection Assay Protocol",
        author="Dr. Evelyn Thorne",
        date="2026-06-23",
        status="Approved",
        content="""### Objective
Optimize lipid-mediated transfection of sgRNA targeting EGFP in HEK293T cell lines.

### Procedure
1. Seed HEK293T cells in 24-well plate to reach 80% confluence ($2 \\times 10^5$ cells/well).
2. Dilute $500\\text{ ng}$ plasmid DNA and $1.5\\mu\\text{L}$ Lipofectamine 3000 in Opti-MEM.
3. Combine and incubate for 15 minutes at room temperature.
4. Add transfection complexes dropwise to cells and culture at 37°C, 5% $CO_2$ for 48 hours.

### Observations
High green fluorescence observed in sample wells. Electroporation fallback was not required.""",
        tables=[
            {
                "headers": ["Well ID", "DNA Conc (ng/uL)", "Fluorescence Ratio", "Status"],
                "rows": [
                    ["A1-Control", "0.0", "1.2%", "Negative"],
                    ["A2-Lipo3K", "25.0", "84.5%", "High Efficiency"],
                    ["A3-Lipo3K", "50.0", "91.2%", "Optimal Efficiency"]
                ]
            }
        ],
        attachments=[{"name": "well_fluorescence_readout.csv", "size": "1.2 MB", "type": "CSV"}],
        references=[{"citation": "Lutolf et al. Synthetic biomaterials as instructive extracellular microenvironments for cell in tissue engineering.", "doi": "10.1021/bm025744e"}]
    )

    n1_v1 = EntryVersion(id="ver-1-1", entry_id="note-1", version="v1.0", user_name="Dr. Evelyn Thorne", timestamp="2026-06-22 14:10", comment="Initial draft setup")
    n1_v2 = EntryVersion(id="ver-1-2", entry_id="note-1", version="v1.1", user_name="Dr. Alex Rivera", timestamp="2026-06-23 09:30", comment="Added fluorescence data table")
    n1_v3 = EntryVersion(id="ver-1-3", entry_id="note-1", version="v1.2", user_name="Dr. Evelyn Thorne", timestamp="2026-06-23 18:12", comment="Signed and locked compliance seal")

    n2 = NotebookEntry(
        id="note-2",
        folder_id="folder-2",
        project_id="proj-2",
        user_id=default_user.id,
        title="Hydrogel Polymer Cross-linking formulations",
        author="Dr. Evelyn Thorne",
        date="2026-06-22",
        status="Draft",
        content="""### Objective
Compare elastic storage modulus ($G'$) of gelatin-acrylamide mixtures under variable UV exposure profiles.

### Procedure
1. Prepare 10% w/v gelatin solutions in PBS at 40°C.
2. Add acrylamide monomer (5% w/v) and Irgacure 2959 photoinitiator.
3. Exposure to 365nm UV source for 60s, 120s, and 180s.

### Observations
Longer exposures showed higher gel fraction but increased brittleness.""",
        tables=[
            {
                "headers": ["Exposure (s)", "Gel Fraction (%)", "Elastic Modulus (kPa)"],
                "rows": [
                    ["60s", "45.2%", "12.4"],
                    ["120s", "78.9%", "24.8"],
                    ["180s", "92.1%", "31.5"]
                ]
            }
        ],
        attachments=[],
        references=[]
    )
    n2_v1 = EntryVersion(id="ver-2-1", entry_id="note-2", version="v1.0", user_name="Dr. Evelyn Thorne", timestamp="2026-06-22 10:45", comment="Drafting initial polymerization notes")

    db.add_all([n1, n1_v1, n1_v2, n1_v3, n2, n2_v1])
    db.commit()

    # 4. Create Shared Resources
    r1 = SharedResource(
        id="res-1",
        name="Confocal Microscope Zeiss LSM 880",
        type="Equipment Log",
        owner="Dr. Evelyn Thorne",
        owner_id=default_user.id,
        permission="Owner",
        shared_with=["Dr. Alex Rivera (Editor)", "Dr. Marcus Vance (Viewer)"],
        last_modified="2026-06-23 18:12"
    )
    r2 = SharedResource(
        id="res-2",
        name="Illumina NextSeq Sequencing Node",
        type="Equipment Log",
        owner="Genomics Lab Center",
        permission="Editor",
        shared_with=["Dr. Evelyn Thorne (Editor)", "Dr. Alex Rivera (Viewer)"],
        last_modified="2026-06-22 14:10"
    )
    r3 = SharedResource(
        id="res-3",
        name="Materials Tensile Tester (Instron 5944)",
        type="Equipment Log",
        owner="Dr. Marcus Vance",
        permission="Viewer",
        shared_with=["Dr. Evelyn Thorne (Viewer)"],
        last_modified="2026-06-21 11:22"
    )
    db.add_all([r1, r2, r3])
    db.commit()

    # 5. Create Research Papers
    p1 = ResearchPaper(
        id="paper-1",
        title="Synthetic biomaterials as instructive extracellular microenvironments",
        authors="Lutolf MP, Hubbell JA",
        journal="Biomacromolecules",
        year="2003",
        doi="10.1021/bm025744e",
        abstract="This review explores design guidelines for creating synthetic hydrogel matrices with biomimetic cues for tissue engineering scaffolds...",
        summary="This review explores design guidelines for creating synthetic hydrogel matrices with biomimetic cues for tissue engineering scaffolds...",
        tags=["Hydrogel", "Scaffold", "Tissue Engineering"]
    )
    p2 = ResearchPaper(
        id="paper-2",
        title="Programmable RNA-guided genome editing in human cells",
        authors="Cong L, Ran FA, Cox D, Lin S, Barretto R, Habib N, Zhang F",
        journal="Science",
        year="2013",
        doi="10.1126/science.1231143",
        abstract="We describe here a programmable RNA-guided genome editing platform based on the CRISPR/Cas9 system that facilitates specific alterations...",
        summary="We describe here a programmable RNA-guided genome editing platform based on the CRISPR/Cas9 system that facilitates specific alterations...",
        tags=["CRISPR", "Genome Editing", "Cas9"]
    )
    db.add_all([p1, p2])
    db.commit()

    # 6. Create Audit Logs
    al1 = AuditLog(id="audit-1", action="FDA 21 CFR Part 11 Compliance Seal Applied", target="Entry: HEK293T Transfection Assay Protocol", user_name="Dr. Evelyn Thorne", timestamp="2026-06-23 18:12:35")
    al2 = AuditLog(id="audit-2", action="Milestone Status Updated to [Completed]", target="Project: PA-CRISPR -> Flow cytometry transfection screening", user_name="Dr. Alex Rivera", timestamp="2026-06-23 14:30:11")
    al3 = AuditLog(id="audit-3", action="New Folder Created", target="Cabinet Folder: Lab SOPs", user_name="Dr. Evelyn Thorne", timestamp="2026-06-22 16:05:42")
    al4 = AuditLog(id="audit-4", action="User Permission Updated", target="Resource Illumina NextSeq: Alex Rivera set to Editor", user_name="Genomics Lab Center", timestamp="2026-06-21 11:22:04")
    db.add_all([al1, al2, al3, al4])
    db.commit()

    # 7. Create Calculation History
    c1 = CalcHistory(id="calc-1", type="Molarity Dilution", formula="M = m / (MW * V)", input="1.0 M NaCl in 100mL", result="5.844 g", date="2026-06-23 10:15", timestamp="2026-06-23 10:15", user_id=default_user.id)
    c2 = CalcHistory(id="calc-2", type="DNA Copy Estimation", formula="Copies = (ng * N_A) / (bp * 1e9 * 660)", input="50ng of 4000 bp", result="1.143e+10 copies", date="2026-06-22 15:42", timestamp="2026-06-22 15:42", user_id=default_user.id)
    db.add_all([c1, c2])
    db.commit()

    # 8. Create Notifications
    notif1 = Notification(id="notif-1", message="Project Artemis milestone sgRNA synthesis was checked by Dr. Alex Rivera", type="info", read=False, timestamp="2026-06-23 14:30", user_id=default_user.id)
    notif2 = Notification(id="notif-2", message="New citation requested for HEK293T clone log", type="warning", read=False, timestamp="2026-06-23 11:15", user_id=default_user.id)
    db.add_all([notif1, notif2])
    db.commit()

    print("[Database Init] MySQL database initialization and seeding completed successfully!")
