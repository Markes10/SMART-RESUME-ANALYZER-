HR AI Platform (local dev)

Quick start (Windows / PowerShell)

1) Create venv and activate
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2) Install dependencies
```powershell
pip install -r requirement.txt
```

3) Configure MySQL (XAMPP)
- Start MySQL in XAMPP
- Create a database (e.g., `swoosh`) and a user with privileges
- Set DATABASE_URL environment variable (PowerShell):
```powershell
$env:DATABASE_URL = "mysql+pymysql://root:password@127.0.0.1:3306/swoosh"
```

4) Create tables (dev)
```powershell
python scripts/create_tables.py
```

5) Run the app
```powershell
python -m uvicorn app.main:app --reload
```

6) Run tests
```powershell
python -m pytest -q
```

Environment variables
- DATABASE_URL: SQLAlchemy DB URL (required)
- JWT_SECRET: secret for JWT tokens (default: dev-secret-change-me)
- ACCESS_TOKEN_EXPIRE_MINUTES: token expiry in minutes (default: 60)

Notes
- For production, replace the simple password hashing with bcrypt and secure secret management.
- Alembic is configured under `alembic/`. Set `sqlalchemy.url` in `alembic.ini` or use `DATABASE_URL` env var.
- ML model initialization is now lazy for embedding generation to avoid import-time downloads.
