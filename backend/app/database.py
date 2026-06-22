"""
In-memory data store for LAB Notebook API.
Seeded with the same initial data that the React frontend's AppContext.jsx
uses, so the frontend can be wired up to this backend with zero visible change.

Replace these plain Python dicts / lists with a real ORM (SQLAlchemy, etc.)
and a proper database engine when you are ready to persist data across restarts.
"""

from copy import deepcopy


# ─────────────────────────────────────────────────────────────────────────────
# Seed Data
# ─────────────────────────────────────────────────────────────────────────────

_seed_user = {
    "name": "Dr. Evelyn Thorne",
    "role": "Principal Investigator",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    "email": "evelyn.thorne@labnotebook.ai",
    "institution": "Institute of Biomolecular Sciences",
    "lab": "Thorne Genomics Lab",
}

_seed_notifications = [
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

_seed_projects = [
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

_seed_notebook_folders = [
    {"id": "folder-1", "name": "Genetics & CRISPR Transfections"},
    {"id": "folder-2", "name": "Hydrogel Synthesis Protocols"},
    {"id": "folder-3", "name": "Microscopy & Image Analysis"},
    {"id": "folder-4", "name": "Standard Operating Procedures (SOP)"},
]

_seed_notebook_entries = [
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

_seed_shared_resources = [
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

_seed_research_papers = [
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

_seed_audit_logs = [
    {"id": "log-1", "timestamp": "2026-06-04 18:12:35", "user": "Dr. Evelyn Thorne", "action": "Digital Signature Applied", "target": "Note: HEK293T Cas9 Transfection Efficiency Assay", "ip": "192.168.1.144", "status": "Compliant"},
    {"id": "log-2", "timestamp": "2026-06-04 18:10:12", "user": "Dr. Evelyn Thorne", "action": "Edit Table Content", "target": "Note: HEK293T Cas9 Transfection Efficiency Assay", "ip": "192.168.1.144", "status": "Compliant"},
    {"id": "log-3", "timestamp": "2026-06-03 14:15:00", "user": "Dr. Marcus Vance", "action": "Join Project Group", "target": "Project: Project Helios Scaffold Synthesis", "ip": "192.168.1.159", "status": "Compliant"},
    {"id": "log-4", "timestamp": "2026-06-02 09:30:11", "user": "Alex Rivera", "action": "Create Document Draft", "target": "Note: HEK293T Cas9 Transfection Efficiency Assay", "ip": "192.168.1.201", "status": "Compliant"},
]

_seed_calc_history = [
    {"id": 1, "type": "Molarity", "formula": "C = n/V", "input": "Mass=5.84g (NaCl), Volume=100mL", "result": "1.0 M NaCl Solution", "date": "June 4, 16:30"},
    {"id": 2, "type": "DNA Copy Number", "formula": "Copies = (ng * 6.022e23) / (length * 1e9 * 660)", "input": "Amount=50ng, Length=4000bp", "result": "1.14 x 10^10 copies", "date": "June 4, 15:45"},
    {"id": 3, "type": "PCR Master Mix", "formula": "xN scaling", "input": "Reactions=10, Vol=50uL each", "result": "Total Taq Mix = 500uL", "date": "June 3, 11:20"},
]


# ─────────────────────────────────────────────────────────────────────────────
# Mutable in-memory DB — all routers import and mutate these
# ─────────────────────────────────────────────────────────────────────────────

db = {
    "user": deepcopy(_seed_user),
    "is_authenticated": False,
    "notifications": deepcopy(_seed_notifications),
    "projects": deepcopy(_seed_projects),
    "notebook_folders": deepcopy(_seed_notebook_folders),
    "notebook_entries": deepcopy(_seed_notebook_entries),
    "shared_resources": deepcopy(_seed_shared_resources),
    "research_papers": deepcopy(_seed_research_papers),
    "audit_logs": deepcopy(_seed_audit_logs),
    "calc_history": deepcopy(_seed_calc_history),
    # Auto-increment counters for numeric IDs
    "_notification_counter": 5,
    "_calc_counter": 4,
}
