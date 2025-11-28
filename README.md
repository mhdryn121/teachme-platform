# Teach Me Something Platform

## 🚀 Quick Start

### Prerequisites
1.  **Docker Desktop** (must be running)
2.  **Node.js** (v18+)

### How to Run

#### 1. Start the Backend & Database
Run this in your terminal:
```bash
docker compose up -d
```
*   **Backend API:** [http://localhost:8000](http://localhost:8000)
*   **API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Start the Frontend
Open a new terminal in the `frontend` folder and run:
```bash
cd frontend
npm run dev
```
*   **Web App:** [http://localhost:3000](http://localhost:3000)

## Project Structure
*   `/backend` - FastAPI (Python) application
*   `/frontend` - Next.js (TypeScript) application
*   `docker-compose.yml` - Infrastructure configuration
