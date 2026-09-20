# ResumeIQ INTELLIGENCE v4.2 🚀
### AI-Powered Resume Intelligence, Analysis, Generation & Visual Editing Platform

![ResumeIQ Intelligence](https://img.shields.io/badge/Gemini_Pro-Powered-orange?style=for-the-badge&logo=google)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-FastAPI-green?style=for-the-badge&logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-teal?style=for-the-badge&logo=tailwindcss)

ResumeIQ INTELLIGENCE v4.2 is a production-grade AI platform designed for job seekers across software engineering, hardware/FPGA, data science, product management, research, and entry-level student roles. Powered by **Google Gemini Pro** (`google-genai` SDK), it automates ATS parsing, multi-vector scoring, job description matrix comparison, GitHub repository bullet extraction, visual drag-and-drop resume editing, and production PDF exports.

---

## Key Features

- **Telemetry Dashboard**: Dossier metrics, ATS Readiness Index radial score gauge (`94 / 100 PTS`), sub-system verification vectors, 7-day iteration delta sparklines, and Institutional Hiring Bar Benchmark Matrix (Google L6 / Meta E6 bars).
- **ATS Deep Audit**: Drag-and-drop resume parser (PDF, DOCX, TXT) with 10-vector score breakdown and ATS Flaw Detector (`Problem` -> `Why` -> `Recommendation`).
- **JD Match Studio**: Matrix comparison table (`Requirement | Resume Evidence | Match Level | Recommendation`) for 25+ target roles and company-specific advice (Stripe, Google, NVIDIA, Microsoft, Startups).
- **GitHub Repository Scanner**: Analyzes public GitHub repos (languages, complexity, README) to generate factual resume bullets (`Action + Technical Work + Context + Result`) without fake metrics.
- **AI Resume IDE**: Visual drag-and-drop section reordering (`@dnd-kit`), floating Gemini AI text assistant (Improve, Concise, Technical, Quantify, ATS Rewrite), live ATS check, and Pre-Export Validation Check.
- **7 Professional Resume Templates**: ATS Classic, Modern Professional, Technical, Academic/Research, Management, Executive, Student/Graduate.
- **User Profile & Modes**: Master career dossier with Student Mode vs Experienced Professional Mode toggle.

---

## Project Structure

```text
AI Resume Generator/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py           # FastAPI entrypoint & CORS
│   │   ├── config.py         # Settings & Gemini API key setup
│   │   ├── routers/          # API route handlers (analyze, jd, github, rewrite, generate)
│   │   ├── services/         # Gemini Pro SDK, PDF/DOCX parser, GitHub inspector
│   │   └── schemas/          # Pydantic data schemas
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # React TypeScript Frontend (Vite)
    ├── src/
    │   ├── components/       # Telemetry Dashboard, IDE, Audit, JD Studio, GitHub, Templates
    │   ├── services/         # Axios API client
    │   └── types/            # TypeScript data interfaces
    ├── package.json
    └── tailwind.config.js    # Stitch UI design tokens
```

---

## Quick Start Guide

### 1. Backend Setup (Python FastAPI)

```bash
cd backend

# Create virtual environment & install dependencies
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Start FastAPI backend server
python -m uvicorn app.main:app --port 8000 --reload
```

Backend server runs at: `http://localhost:8000` (Swagger docs: `http://localhost:8000/docs`)

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Environment Variables & Gemini Key

The platform includes a built-in Gemini API key manager directly in the top header UI. You can also configure your key via environment variable:

```bash
export GEMINI_API_KEY="your-google-gemini-api-key"
```

If no key is provided, the platform seamlessly uses intelligent mock heuristic fallbacks for offline testing.

---

## License

MIT License
