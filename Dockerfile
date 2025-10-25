FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directories
RUN mkdir -p uploads/resumes

# Expose port
EXPOSE 8000

# Run database initialization and start the app
CMD ["sh", "-c", "python scripts/init_database.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
