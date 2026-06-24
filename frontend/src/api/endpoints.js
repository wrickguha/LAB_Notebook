// LocalStorage mock API implementation for LAB Notebook

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Seed Data
const defaultUser = {
  name: 'Dr. Evelyn Thorne',
  role: 'Principal Investigator',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  email: 'evelyn.thorne@labnotebook.ai',
  institution: 'Institute of Biomolecular Sciences',
  lab: 'Thorne Genomics Lab',
};

const defaultNotifications = [
  {
    id: "notif-1",
    message: "Project Artemis milestone sgRNA synthesis was checked by Dr. Alex Rivera",
    type: "info",
    read: false,
    timestamp: "2026-06-23 14:30"
  },
  {
    id: "notif-2",
    message: "New citation requested for HEK293T clone log",
    type: "warning",
    read: false,
    timestamp: "2026-06-23 11:15"
  }
];

const defaultProjects = [
  {
    id: "proj-1",
    code: "PA-CRISPR",
    name: "Project Artemis: CRISPR Engineering",
    description: "sgRNA design, transfection assay targeting cell line vectors, validation via gel electrophoresis and Western blot.",
    status: "Active",
    progress: 68,
    banner: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800",
    lastActivity: "2026-06-23T18:12:35.000Z",
    milestones: [
      { id: "m1-1", name: "sgRNA synthesis & purification", completed: true },
      { id: "m1-2", name: "Flow cytometry transfection screening", completed: true },
      { id: "m1-3", name: "Western Blot analysis confirmation", completed: false }
    ],
    members: [
      { name: "Dr. Evelyn Thorne", role: "Principal Investigator", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
      { name: "Dr. Alex Rivera", role: "Postdoctoral Researcher", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" }
    ]
  },
  {
    id: "proj-2",
    code: "PH-HYDRO",
    name: "Project Helios: Scaffold Hydrogels",
    description: "Synthesizing cross-linked polyacrylamide/gelatin networks for tissue scaffolds, testing tensile yield points.",
    status: "Planning",
    progress: 25,
    banner: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800",
    lastActivity: "2026-06-22T10:45:00.000Z",
    milestones: [
      { id: "m2-1", name: "Polymer cross-linking formulation", completed: true },
      { id: "m2-2", name: "Elastic modulus tensile stress profiling", completed: false },
      { id: "m2-3", name: "Biocompatibility assay with cell line HEK293T", completed: false }
    ],
    members: [
      { name: "Dr. Evelyn Thorne", role: "Principal Investigator", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }
    ]
  }
];

const defaultFolders = [
  { id: "folder-1", name: "CRISPR & Genetics" },
  { id: "folder-2", name: "Scaffold Polymers" },
  { id: "folder-3", name: "Lab SOPs" }
];

const defaultEntries = [
  {
    id: "note-1",
    folderId: "folder-1",
    projectId: "proj-1",
    title: "HEK293T Transfection Assay Protocol",
    author: "Dr. Evelyn Thorne",
    date: "2026-06-23",
    status: "Approved",
    content: `### Objective
Optimize lipid-mediated transfection of sgRNA targeting EGFP in HEK293T cell lines.

### Procedure
1. Seed HEK293T cells in 24-well plate to reach 80% confluence ($2 \\times 10^5$ cells/well).
2. Dilute $500\\text{ ng}$ plasmid DNA and $1.5\\mu\\text{L}$ Lipofectamine 3000 in Opti-MEM.
3. Combine and incubate for 15 minutes at room temperature.
4. Add transfection complexes dropwise to cells and culture at 37°C, 5% $CO_2$ for 48 hours.

### Observations
High green fluorescence observed in sample wells. Electroporation fallback was not required.`,
    tables: [
      {
        headers: ["Well ID", "DNA Conc (ng/uL)", "Fluorescence Ratio", "Status"],
        rows: [
          ["A1-Control", "0.0", "1.2%", "Negative"],
          ["A2-Lipo3K", "25.0", "84.5%", "High Efficiency"],
          ["A3-Lipo3K", "50.0", "91.2%", "Optimal Efficiency"]
        ]
      }
    ],
    attachments: [
      { name: "well_fluorescence_readout.csv", size: "1.2 MB", type: "CSV" }
    ],
    references: [
      { citation: "Lutolf et al. Synthetic biomaterials as instructive extracellular microenvironments for cell in tissue engineering.", doi: "10.1021/bm025744e" }
    ],
    versionHistory: [
      { version: "v1.0", user: "Dr. Evelyn Thorne", timestamp: "2026-06-22 14:10", comment: "Initial draft setup" },
      { version: "v1.1", user: "Dr. Alex Rivera", timestamp: "2026-06-23 09:30", comment: "Added fluorescence data table" },
      { version: "v1.2", user: "Dr. Evelyn Thorne", timestamp: "2026-06-23 18:12", comment: "Signed and locked compliance seal" }
    ]
  },
  {
    id: "note-2",
    folderId: "folder-2",
    projectId: "proj-2",
    title: "Hydrogel Polymer Cross-linking formulations",
    author: "Dr. Evelyn Thorne",
    date: "2026-06-22",
    status: "Draft",
    content: `### Objective
Compare elastic storage modulus ($G'$) of gelatin-acrylamide mixtures under variable UV exposure profiles.

### Procedure
1. Prepare 10% w/v gelatin solutions in PBS at 40°C.
2. Add acrylamide monomer (5% w/v) and Irgacure 2959 photoinitiator.
3. Exposure to 365nm UV source for 60s, 120s, and 180s.

### Observations
Longer exposures showed higher gel fraction but increased brittleness.`,
    tables: [
      {
        headers: ["Exposure (s)", "Gel Fraction (%)", "Elastic Modulus (kPa)"],
        rows: [
          ["60s", "45.2%", "12.4"],
          ["120s", "78.9%", "24.8"],
          ["180s", "92.1%", "31.5"]
        ]
      }
    ],
    attachments: [],
    references: [],
    versionHistory: [
      { version: "v1.0", user: "Dr. Evelyn Thorne", timestamp: "2026-06-22 10:45", comment: "Drafting initial polymerization notes" }
    ]
  }
];

const defaultResources = [
  { 
    id: "res-1", 
    name: "Confocal Microscope Zeiss LSM 880", 
    type: "Equipment Log", 
    owner: "Dr. Evelyn Thorne", 
    permission: "Owner",
    sharedWith: ["Dr. Alex Rivera (Editor)", "Dr. Marcus Vance (Viewer)"],
    lastModified: "2026-06-23 18:12"
  },
  { 
    id: "res-2", 
    name: "Illumina NextSeq Sequencing Node", 
    type: "Equipment Log", 
    owner: "Genomics Lab Center", 
    permission: "Editor",
    sharedWith: ["Dr. Evelyn Thorne (Editor)", "Dr. Alex Rivera (Viewer)"],
    lastModified: "2026-06-22 14:10"
  },
  { 
    id: "res-3", 
    name: "Materials Tensile Tester (Instron 5944)", 
    type: "Equipment Log", 
    owner: "Dr. Marcus Vance", 
    permission: "Viewer",
    sharedWith: ["Dr. Evelyn Thorne (Viewer)"],
    lastModified: "2026-06-21 11:22"
  }
];

const defaultPapers = [
  {
    id: "paper-1",
    title: "Synthetic biomaterials as instructive extracellular microenvironments",
    authors: "Lutolf MP, Hubbell JA",
    journal: "Biomacromolecules",
    year: "2003",
    doi: "10.1021/bm025744e",
    abstract: "This review explores design guidelines for creating synthetic hydrogel matrices with biomimetic cues for tissue engineering scaffolds...",
    summary: "This review explores design guidelines for creating synthetic hydrogel matrices with biomimetic cues for tissue engineering scaffolds...",
    tags: ["Hydrogel", "Scaffold", "Tissue Engineering"]
  },
  {
    id: "paper-2",
    title: "Programmable RNA-guided genome editing in human cells",
    authors: "Cong L, Ran FA, Cox D, Lin S, Barretto R, Habib N, Zhang F",
    journal: "Science",
    year: "2013",
    doi: "10.1126/science.1231143",
    abstract: "We describe here a programmable RNA-guided genome editing platform based on the CRISPR/Cas9 system that facilitates specific alterations...",
    summary: "We describe here a programmable RNA-guided genome editing platform based on the CRISPR/Cas9 system that facilitates specific alterations...",
    tags: ["CRISPR", "Genome Editing", "Cas9"]
  }
];

const defaultAuditLogs = [
  {
    id: "audit-1",
    action: "FDA 21 CFR Part 11 Compliance Seal Applied",
    target: "Entry: HEK293T Transfection Assay Protocol",
    user: "Dr. Evelyn Thorne",
    timestamp: "2026-06-23 18:12:35"
  },
  {
    id: "audit-2",
    action: "Milestone Status Updated to [Completed]",
    target: "Project: PA-CRISPR -> Flow cytometry transfection screening",
    user: "Dr. Alex Rivera",
    timestamp: "2026-06-23 14:30:11"
  },
  {
    id: "audit-3",
    action: "New Folder Created",
    target: "Cabinet Folder: Lab SOPs",
    user: "Dr. Evelyn Thorne",
    timestamp: "2026-06-22 16:05:42"
  },
  {
    id: "audit-4",
    action: "User Permission Updated",
    target: "Resource Illumina NextSeq: Alex Rivera set to Editor",
    user: "Genomics Lab Center",
    timestamp: "2026-06-21 11:22:04"
  }
];

const defaultCalcHistory = [
  {
    id: "calc-1",
    type: "Molarity Dilution",
    formula: "M = m / (MW * V)",
    input: "1.0 M NaCl in 100mL",
    result: "5.844 g",
    date: "2026-06-23 10:15",
    timestamp: "2026-06-23 10:15"
  },
  {
    id: "calc-2",
    type: "DNA Copy Estimation",
    formula: "Copies = (ng * N_A) / (bp * 1e9 * 660)",
    input: "50ng of 4000 bp",
    result: "1.143e+10 copies",
    date: "2026-06-22 15:42",
    timestamp: "2026-06-22 15:42"
  }
];

const getDb = (key, defaultData) => {
  const data = localStorage.getItem(`biotech_${key}`);
  if (!data) {
    localStorage.setItem(`biotech_${key}`, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    const parsed = JSON.parse(data);
    // Dynamic migration: if it's an array and defaultData is an array of objects,
    // ensure all keys in defaultData's items are present in parsed items.
    if (Array.isArray(parsed) && Array.isArray(defaultData) && defaultData.length > 0) {
      let migrated = false;
      const defaultKeysObj = {};
      defaultData.forEach(d => {
        Object.keys(d).forEach(k => {
          defaultKeysObj[k] = d[k];
        });
      });
      const newParsed = parsed.map(item => {
        let itemMigrated = false;
        const newItem = { ...item };
        for (const k of Object.keys(defaultKeysObj)) {
          if (newItem[k] === undefined) {
            newItem[k] = defaultKeysObj[k];
            itemMigrated = true;
          }
        }
        if (itemMigrated) migrated = true;
        return newItem;
      });
      if (migrated) {
        localStorage.setItem(`biotech_${key}`, JSON.stringify(newParsed));
        return newParsed;
      }
    }
    return parsed;
  } catch (e) {
    return defaultData;
  }
};

const setDb = (key, data) => {
  localStorage.setItem(`biotech_${key}`, JSON.stringify(data));
};

const addLocalAuditLog = (action, target) => {
  const user = getDb('user', defaultUser);
  const logs = getDb('audit_logs', defaultAuditLogs);
  const now = new Date();
  const formatTime = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const newLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    action,
    target,
    user: user.name,
    timestamp: formatTime(now)
  };
  logs.unshift(newLog);
  setDb('audit_logs', logs);
  return newLog;
};

export const authApi = {
  login: async (credentials) => {
    await delay(150);
    return { success: true, message: "Logged in successfully" };
  },
  logout: async () => {
    await delay(100);
    return { success: true };
  },
};

export const userApi = {
  getUser: async () => {
    await delay(100);
    return getDb('user', defaultUser);
  },
  updateUser: async (updates) => {
    await delay(150);
    const user = getDb('user', defaultUser);
    const updated = { ...user, ...updates };
    setDb('user', updated);
    addLocalAuditLog('User Profile Updated', `Settings saved for ${updated.name}`);
    return updated;
  },
};

export const notificationsApi = {
  list: async () => {
    await delay(100);
    return getDb('notifications', defaultNotifications);
  },
  markRead: async () => {
    await delay(100);
    const list = getDb('notifications', defaultNotifications);
    const updated = list.map(n => ({ ...n, read: true }));
    setDb('notifications', updated);
    return { success: true };
  },
};

export const projectsApi = {
  list: async () => {
    await delay(150);
    return getDb('projects', defaultProjects);
  },
  create: async (projectData) => {
    await delay(200);
    const projects = getDb('projects', defaultProjects);
    const newProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      members: projectData.members || [
        { name: "Dr. Evelyn Thorne", role: "Principal Investigator", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }
      ],
      progress: projectData.progress || 0,
      lastActivity: new Date().toISOString()
    };
    projects.push(newProject);
    setDb('projects', projects);
    addLocalAuditLog('New Project Initialized', `Project: ${newProject.name} (${newProject.code})`);
    return newProject;
  },
  toggleMilestone: async (projectId, milestoneId) => {
    await delay(150);
    const projects = getDb('projects', defaultProjects);
    const projIdx = projects.findIndex(p => p.id === projectId);
    if (projIdx === -1) throw new Error('Project not found');
    
    const project = projects[projIdx];
    let milestoneName = '';
    let isCompleted = false;

    project.milestones = project.milestones.map(m => {
      if (m.id === milestoneId) {
        milestoneName = m.name;
        isCompleted = !m.completed;
        return { ...m, completed: isCompleted };
      }
      return m;
    });

    const completedCount = project.milestones.filter(m => m.completed).length;
    const totalCount = project.milestones.length;
    project.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    project.lastActivity = new Date().toISOString();

    projects[projIdx] = project;
    setDb('projects', projects);

    addLocalAuditLog(
      `Milestone Status Updated to [${isCompleted ? 'Completed' : 'Pending'}]`,
      `Project: ${project.code} -> ${milestoneName}`
    );

    return project;
  },
};

export const notebookApi = {
  listFolders: async () => {
    await delay(100);
    return getDb('folders', defaultFolders);
  },
  createFolder: async (name) => {
    await delay(150);
    const folders = getDb('folders', defaultFolders);
    const newFolder = {
      id: `folder-${Date.now()}`,
      name
    };
    folders.push(newFolder);
    setDb('folders', folders);
    addLocalAuditLog('New Folder Created', `Cabinet Folder: ${name}`);
    return newFolder;
  },
  listEntries: async (folderId) => {
    await delay(150);
    const entries = getDb('entries', defaultEntries);
    if (folderId) {
      return entries.filter(e => e.folderId === folderId);
    }
    return entries;
  },
  getEntry: async (id) => {
    await delay(100);
    const entries = getDb('entries', defaultEntries);
    const entry = entries.find(e => e.id === id);
    if (!entry) throw new Error('Entry not found');
    return entry;
  },
  createEntry: async (entryData) => {
    await delay(200);
    const entries = getDb('entries', defaultEntries);
    const user = getDb('user', defaultUser);
    const newEntry = {
      id: `note-${Date.now()}`,
      folderId: entryData.folderId,
      projectId: entryData.projectId || '',
      title: entryData.title || 'Untitled Experiment Entry',
      author: user.name,
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      content: entryData.content || '### Objective\n\n### Procedure\n\n### Observations',
      tables: entryData.tables || [],
      attachments: entryData.attachments || [],
      references: entryData.references || [],
      versionHistory: [
        {
          version: 'v1.0',
          user: user.name,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          comment: 'Initial draft setup'
        }
      ]
    };
    entries.push(newEntry);
    setDb('entries', entries);
    addLocalAuditLog('Notebook Draft Created', `Entry: ${newEntry.title}`);
    return newEntry;
  },
  updateEntryContent: async (id, { content, title }) => {
    await delay(100);
    const entries = getDb('entries', defaultEntries);
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Entry not found');
    
    const entry = entries[idx];
    if (entry.status === 'Approved') throw new Error('Cannot update approved entry');

    let updated = false;
    if (title !== undefined && title !== entry.title) {
      entry.title = title;
      updated = true;
    }
    if (content !== undefined && content !== entry.content) {
      entry.content = content;
      updated = true;
    }

    if (updated) {
      const user = getDb('user', defaultUser);
      const nextVerNum = (parseFloat(entry.versionHistory[entry.versionHistory.length - 1].version.replace('v', '')) + 0.1).toFixed(1);
      entry.versionHistory.push({
        version: `v${nextVerNum}`,
        user: user.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        comment: 'Content updated'
      });
      entry.lastActivity = new Date().toISOString();
      entries[idx] = entry;
      setDb('entries', entries);
    }
    return entry;
  },
  signEntry: async (id) => {
    await delay(200);
    const entries = getDb('entries', defaultEntries);
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Entry not found');
    
    const entry = entries[idx];
    if (entry.status === 'Approved') return entry;

    entry.status = 'Approved';
    const user = getDb('user', defaultUser);
    const nextVerNum = (parseFloat(entry.versionHistory[entry.versionHistory.length - 1].version.replace('v', '')) + 0.1).toFixed(1);
    entry.versionHistory.push({
      version: `v${nextVerNum}`,
      user: user.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      comment: 'Signed and locked compliance seal'
    });
    
    entries[idx] = entry;
    setDb('entries', entries);

    addLocalAuditLog('FDA 21 CFR Part 11 Compliance Seal Applied', `Entry: ${entry.title}`);
    
    return entry;
  },
};

export const resourcesApi = {
  list: async () => {
    await delay(100);
    return getDb('resources', defaultResources);
  },
  create: async (resourceData) => {
    await delay(150);
    const resources = getDb('resources', defaultResources);
    const user = getDb('user', defaultUser);
    const now = new Date();
    const formatTime = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    const newResource = {
      id: `res-${Date.now()}`,
      name: resourceData.name,
      type: resourceData.type || 'Folder',
      owner: user.name,
      permission: resourceData.permission || 'Owner',
      sharedWith: resourceData.sharedWith || [],
      lastModified: formatTime(now)
    };
    resources.push(newResource);
    setDb('resources', resources);
    addLocalAuditLog('New Resource Registered', `Resource: ${newResource.name}`);
    return newResource;
  },
  updatePermission: async (resourceId, { targetUser, newLevel }) => {
    await delay(150);
    const resources = getDb('resources', defaultResources);
    const idx = resources.findIndex(r => r.id === resourceId);
    if (idx === -1) throw new Error('Resource not found');
    
    if (resources[idx].sharedWith) {
      resources[idx].sharedWith = resources[idx].sharedWith.map(collab => {
        const name = collab.split(' (')[0];
        if (name === targetUser) {
          return `${targetUser} (${newLevel})`;
        }
        return collab;
      });
    }

    const now = new Date();
    const formatTime = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    resources[idx].lastModified = formatTime(now);

    setDb('resources', resources);
    addLocalAuditLog('Resource Permission Updated', `Resource ${resources[idx].name}: ${targetUser} set to ${newLevel}`);
    return resources[idx];
  },
};

export const papersApi = {
  list: async () => {
    await delay(100);
    return getDb('papers', defaultPapers);
  },
  create: async (paperData) => {
    await delay(150);
    const papers = getDb('papers', defaultPapers);
    const newPaper = {
      ...paperData,
      id: `paper-${Date.now()}`
    };
    papers.push(newPaper);
    setDb('papers', papers);
    addLocalAuditLog('New Paper Reference Uploaded', `Paper: ${newPaper.title}`);
    return newPaper;
  },
};

export const auditLogsApi = {
  list: async (searchQuery) => {
    await delay(100);
    const logs = getDb('audit_logs', defaultAuditLogs);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return logs.filter(l => 
        l.action.toLowerCase().includes(q) || 
        l.target.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q)
      );
    }
    return logs;
  },
  create: async (logData) => {
    await delay(50);
    return addLocalAuditLog(logData.action, logData.target);
  },
};

export const calcHistoryApi = {
  list: async () => {
    await delay(100);
    return getDb('calc_history', defaultCalcHistory);
  },
  create: async (calcData) => {
    await delay(100);
    const history = getDb('calc_history', defaultCalcHistory);
    const newCalc = {
      id: `calc-${Date.now()}`,
      type: calcData.type,
      input: calcData.input,
      result: calcData.result,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    history.unshift(newCalc);
    setDb('calc_history', history);
    addLocalAuditLog('Calculator Run Saved', `${newCalc.type}: ${newCalc.input}`);
    return newCalc;
  },
};

export const dashboardApi = {
  getSummary: async () => {
    await delay(100);
    return { success: true };
  },
};
