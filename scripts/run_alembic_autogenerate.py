"""Run alembic.autogenerate in-process with DATABASE_URL set to sqlite dev.db.
This avoids shell quoting/env issues on Windows when calling alembic CLI.
"""
import os
from alembic.config import Config
from alembic import command


def main():
    os.environ.setdefault("DATABASE_URL", "sqlite:///./dev.db")
    cfg = Config("alembic.ini")
    # Ensure the script_location is correct
    cfg.set_main_option("script_location", "alembic")
    print("Running alembic.autogenerate with DATABASE_URL=", os.environ["DATABASE_URL"])
    command.revision(cfg, message="initial", autogenerate=True)


if __name__ == "__main__":
    main()
