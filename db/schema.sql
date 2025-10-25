-- Create the database
CREATE DATABASE IF NOT EXISTS hr_app;
USE hr_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    resume_text TEXT,
    skills JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    required_skills JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT,
    candidate_id INT,
    interview_date DATETIME,
    questions JSON,
    feedback TEXT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (candidate_id) REFERENCES users(id)
);

-- Performance reviews table
CREATE TABLE IF NOT EXISTS performance_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    reviewer_id INT,
    review_period VARCHAR(50),
    goals JSON,
    achievements TEXT,
    feedback TEXT,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- Learning paths table
CREATE TABLE IF NOT EXISTS learning_paths (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced'),
    duration VARCHAR(100),
    modules INT DEFAULT 0,
    progress INT DEFAULT 0,
    completed_modules INT DEFAULT 0,
    skills JSON,
    format JSON,
    rating FLOAT DEFAULT 0,
    enrollment INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    current INT DEFAULT 0,
    target INT DEFAULT 0,
    importance ENUM('High', 'Medium', 'Low'),
    category VARCHAR(100),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('Course', 'Certification', 'Workshop', 'Mentoring', 'Conference'),
    provider VARCHAR(255),
    duration VARCHAR(100),
    difficulty VARCHAR(100),
    relevance_score INT DEFAULT 0,
    description TEXT,
    skills JSON,
    cost VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    date DATE,
    type VARCHAR(100),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    check_in DATETIME,
    check_out DATETIME,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Compensation records table
CREATE TABLE IF NOT EXISTS compensation_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    salary DECIMAL(10,2),
    bonus DECIMAL(10,2),
    effective_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Job matches table
CREATE TABLE IF NOT EXISTS job_matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT,
    resume_id INT,
    match_score FLOAT,
    skills_matched JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (resume_id) REFERENCES resumes(id)
);

-- Diversity metrics table
CREATE TABLE IF NOT EXISTS diversity_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department VARCHAR(100),
    metrics JSON,
    report_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
