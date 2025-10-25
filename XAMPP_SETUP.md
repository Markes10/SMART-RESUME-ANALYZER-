# XAMPP Deployment Guide

## Prerequisites
1. Install XAMPP (with Apache, MySQL, and PHP)
2. Install Python 3.8 or higher
3. Install Node.js and pnpm

## Database Setup
1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin (http://localhost/phpmyadmin)
4. Create a new database:
   - Click "New" in the left sidebar
   - Enter "hr_app" as the database name
   - Click "Create"
5. Import the schema:
   - Select the "hr_app" database
   - Click "Import" in the top menu
   - Choose the file `app/db/schema.sql`
   - Click "Go" to import

## Backend Setup
1. Create a Python virtual environment:
   ```bash
   cd app
   python -m venv venv
   venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Frontend Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

## Ollama Setup (for AI features)
1. Download and install Ollama from https://ollama.ai
2. Pull the Mistral model:
   ```bash
   ollama pull mistral
   ```
3. Start the Ollama service:
   ```bash
   ollama serve
   ```

## Testing the Application
1. Open http://localhost:5173 in your browser
2. All API endpoints are available at http://localhost:8000
3. API documentation is available at http://localhost:8000/docs

## Common Issues
1. If MySQL connection fails:
   - Check if MySQL service is running in XAMPP
   - Verify the database credentials in .env file
   - Make sure the hr_app database exists

2. If Ollama connection fails:
   - Ensure Ollama service is running
   - Check if the Mistral model is downloaded
   - Verify the OLLAMA_ENDPOINT in .env file

3. If file uploads fail:
   - Check the upload directory permissions
   - Verify the maximum file size settings in PHP
