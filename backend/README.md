# LAB Notebook — FastAPI Backend

A complete RESTful Python backend built with **FastAPI** that serves all endpoints consumed by the React frontend dashboard.

## 📁 Project Structure

```
backend/
├── requirements.txt
└── app/
    ├── __init__.py
    ├── main.py          ← FastAPI app + CORS + router registration
    ├── database.py      ← In-memory data store (seeded from AppContext.jsx)
    ├── schemas.py       ← All Pydantic request/response models
    └── routers/
        ├── __init__.py
        ├── auth.py          ← POST /api/auth/login|logout
        ├── user.py          ← GET|PATCH /api/user
        ├── notifications.py ← GET /api/notifications, PATCH mark-read
        ├── projects.py      ← GET|POST /api/projects, PATCH milestone
        ├── notebook.py      ← Full CRUD for folders + entries, sign endpoint
        ├── resources.py     ← GET|POST /api/resources, PATCH permission
        ├── papers.py        ← GET|POST /api/papers
        ├── audit_logs.py    ← GET (filterable)|POST /api/audit-logs
        ├── calc_history.py  ← GET|POST /api/calc-history
        ├── calculators.py   ← 5 POST calculator endpoints
        ├── analytics.py     ← GET chart data endpoints
        └── dashboard.py     ← GET /api/dashboard/summary
```

## 🚀 Running the Server

```powershell
# From e:\BioTech\backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health:** http://localhost:8000/health

## 📡 Complete API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Simulated login (no JWT yet) |
| POST | `/api/auth/logout` | Log out + audit entry |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | Get investigator profile |
| PATCH | `/api/user` | Update profile fields |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List all notifications |
| PATCH | `/api/notifications/mark-read` | Mark all as read |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create a new project |
| PATCH | `/api/projects/{id}/milestone/{mid}` | Toggle milestone + recalculate progress |

### Lab Notebook
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notebook/folders` | List all folders |
| POST | `/api/notebook/folders` | Create a folder |
| GET | `/api/notebook/entries?folderId=...` | List entries (optional folder filter) |
| GET | `/api/notebook/entries/{id}` | Get single entry |
| POST | `/api/notebook/entries` | Create draft entry |
| PATCH | `/api/notebook/entries/{id}/content` | Update content + version bump |
| POST | `/api/notebook/entries/{id}/sign` | Digitally sign and lock |

### Shared Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources` | List all resources |
| POST | `/api/resources` | Share a new resource |
| PATCH | `/api/resources/{id}/permission` | Update collaborator role |

### Research Papers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/papers` | List all reference papers |
| POST | `/api/papers` | Add a new paper |

### Audit Logs (FDA 21 CFR Part 11)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/audit-logs?q=...` | List logs (optional text filter) |
| POST | `/api/audit-logs` | Manually add a log entry |

### Calculator History
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calc-history` | List calculation history |
| POST | `/api/calc-history` | Add a history entry |

### Scientific Calculators (Server-Side Computation)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/calculators/molarity` | M = m / (MW × V) |
| POST | `/api/calculators/dna-copy-number` | Avogadro-based copy count |
| POST | `/api/calculators/pcr-mix` | PCR master mix scaler |
| POST | `/api/calculators/half-life-decay` | N(t) = N₀ × 0.5^(t/T) |
| POST | `/api/calculators/statistics` | Mean, std dev, variance, min, max |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/productivity` | Weekly workload chart data |
| GET | `/api/analytics/resources` | Equipment usage chart data |
| GET | `/api/analytics/pipeline` | Publication pipeline chart data |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Live KPI counters |

## 🔌 Wiring the Frontend

The frontend currently uses **in-memory React state** via `AppContext.jsx`. To connect it to this backend, replace the state mutations with `axios` calls pointing to `http://localhost:8000`.

### Example — Projects fetch in AppContext.jsx:
```js
// BEFORE (in-memory)
const [projects, setProjects] = useState([...]);

// AFTER (API-connected)
import axios from 'axios';
const API = 'http://localhost:8000';

const [projects, setProjects] = useState([]);
useEffect(() => {
  axios.get(`${API}/api/projects`).then(r => setProjects(r.data));
}, []);

const addProject = async (newProject) => {
  const { data } = await axios.post(`${API}/api/projects`, newProject);
  setProjects(prev => [data, ...prev]);
};
```

## ⚙️ Data Persistence

The current implementation uses an **in-memory dict** (`app/database.py`). Data resets on server restart. To add persistence, replace `db` with SQLAlchemy models connected to SQLite/PostgreSQL — the schemas in `schemas.py` map 1:1 to database columns.
