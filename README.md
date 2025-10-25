# Smart Resume Analyzer - HR AI Platform

An intelligent HR management platform that leverages AI and machine learning to streamline recruitment, employee development, and organizational analytics.

## 🚀 Key Features

### Resume Fit Analysis
- **AI-Powered Matching**: Matches resumes to job descriptions using NLP and embedding models
- **Skill Gap Analysis**: Identifies missing skills and provides personalized recommendations
- **Automated Scoring**: Provides compatibility scores with detailed breakdowns

### Interview Copilot
- **Real-time Evaluation**: Assists interviewers with real-time feedback and evaluation
- **Question Recommendations**: Suggests follow-up questions based on candidate responses

### Performance Feedback
- **ML-Driven Insights**: Analyzes employee performance with machine learning insights
- **Goal Tracking**: Monitors progress toward objectives and key results

### Learning Paths
- **Personalized Development**: Recommends customized learning journeys
- **Skill Progression**: Tracks skill development over time

### Compensation Analyzer
- **Market Benchmarking**: Benchmarks and suggests fair compensation
- **Equity Insights**: Ensures pay equity across demographics

### Diversity & Inclusion
- **Fairness Monitoring**: Monitors fairness metrics across hiring and promotions
- **Bias Detection**: Identifies potential bias in HR processes

### Turnover Retention
- **Attrition Prediction**: Predicts employee churn risk using advanced models
- **Retention Strategies**: Recommends interventions to improve retention

### Attendance Detector
- **Anomaly Detection**: Identifies unusual attendance patterns
- **Predictive Analytics**: Forecasts potential attendance issues

### Onboarding Journey
- **Structured Guidance**: Guides new hires through comprehensive onboarding
- **Progress Tracking**: Monitors onboarding completion and engagement

## 🛠️ Technology Stack

### Backend
- **Python 3.11** with **FastAPI** framework
- **MySQL** database with **SQLAlchemy** ORM
- **Uvicorn** ASGI server
- **JWT** authentication

### Frontend
- **React 18** with **TypeScript**
- **Vite** build tool
- **Tailwind CSS** for styling
- **Shadcn UI** components

### Machine Learning & AI
- **Transformers** and **Sentence Transformers** for NLP
- **Scikit-learn** for machine learning
- **SHAP** and **LIME** for model interpretability
- **Fairlearn** and **AIF360** for fairness analysis
- **Prophet** for time series forecasting

### DevOps & Testing
- **Docker** containerization
- **pytest** and **vitest** for testing
- **Nginx** reverse proxy for production

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- MySQL database (or use XAMPP for local development)
- Docker (optional, for containerized deployment)

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd smart-resume-analyzer
   ```

2. **Backend Setup**:
   ```bash
   # Create virtual environment
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Configure database
   # Set DATABASE_URL environment variable
   export DATABASE_URL=mysql+pymysql://user:password@localhost:3306/hr_app
   
   # Initialize database
   python scripts/init_database.py
   
   # Run the backend
   uvicorn main:app --reload
   ```

3. **Frontend Setup**:
   ```bash
   # Install dependencies
   npm install
   
   # Run development server
   npm run dev
   ```

### Production Deployment

Using Docker Compose:
```bash
# Copy production environment file
cp .env.prod .env

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
├── app/                 # FastAPI application
├── client/              # React frontend
├── db/                  # Database models and schema
├── routes/              # API routes
├── services/            # Business logic and services
├── ml/                  # Machine learning models
├── scripts/             # Utility scripts
├── tests/               # Test suite
├── docker-compose.prod.yml  # Production Docker configuration
└── nginx.conf           # Nginx reverse proxy configuration
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:
```bash
# Database
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/hr_app

# JWT Settings
JWT_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=60

# API URLs
VITE_API_URL=http://localhost:8000
```

## 🧪 Testing

Run backend tests:
```bash
python -m pytest
```

Run frontend tests:
```bash
npm run test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email [your-email] or open an issue in the repository.