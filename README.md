<div align="center">

# 🛡️ AegisOps

### AI-Powered DevSecOps Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/ML_on-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Predict deployment failures before they happen. Detect security risks. Analyze system logs. Get intelligent remediation — all powered by AI.**

[Live Demo](#deployment) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Get Started](#-getting-started) · [Architecture](#-architecture)

---

</div>

## 📖 Overview

**AegisOps** is an enterprise-grade **AI-powered DevSecOps platform** that combines machine learning, cybersecurity intelligence, cloud monitoring, and automation into a single operational command center. It helps engineering teams build, secure, and deploy applications with greater confidence by providing:

- 🔮 **Predictive failure analysis** before every deployment
- 🧠 **Explainable AI (XAI)** with SHAP feature attribution graphs
- 🔒 **Vulnerability scanning** and security posture assessment
- 📊 **Real-time infrastructure observability** with live metrics
- 🤖 **AI Copilot** for context-aware DevOps Q&A
- 🎯 **Chaos engineering simulations** via digital twin technology

---

## ✨ Features

### 🔮 AI Deployment Failure Predictor
- Ensemble ML models (XGBoost, Random Forest, LightGBM) predict deployment risk scores
- SHAP-based explainable AI shows **why** a deployment might fail
- Outage forecasting horizons (1hr, 6hr, 24hr)
- Historical incident similarity matching engine

### 🧬 Digital Twin Simulator
- Simulate traffic spikes, CPU overload, memory pressure, and network chaos
- Predict blast radius, latency impact, and MTTR before running experiments
- Real-time risk assessment with actionable warnings

### 🤖 AI DevOps Copilot
- Context-aware natural language interface for DevOps queries
- Integrates live telemetry data with a deep DevOps knowledge base
- Answers questions about deployments, incidents, infrastructure, security, and SRE practices

### 📊 Infrastructure Observability
- Real-time CPU, memory, network, and error rate monitoring
- Live metric dashboards with animated gauges and trend lines
- Multi-service health status tracking

### 🔍 Root Cause Analysis
- AI-driven incident investigation engine
- Automated root cause detection with confidence scoring
- Correlated timeline analysis across services

### 🔒 Security & Vulnerability Dashboard
- Dependency vulnerability scanning (CVE tracking)
- Security posture scoring with risk categorization
- Remediation recommendations with priority ranking

### 📈 DORA Metrics & Engineering Intelligence
- Deployment Frequency, Lead Time, MTTR, Change Failure Rate
- Team velocity insights and engineering health scores
- Executive-level reporting dashboards

### ⚡ Additional Modules
- **Chaos Engineering** — controlled fault injection experiments
- **CI/CD Pipeline Analytics** — build & deploy pipeline monitoring
- **Cost Optimization** — cloud spend analysis and recommendations
- **Dependency Graph** — service dependency visualization
- **Incident Management** — alert routing, escalation, and resolution tracking
- **Log Intelligence** — AI-powered log analysis and anomaly detection
- **Outage Prediction** — proactive outage risk forecasting
- **Rollback Automation** — one-click deployment rollbacks with safety checks
- **SRE Dashboard** — service reliability engineering command center
- **Team Insights** — developer productivity and collaboration metrics

---

## 🛠 Tech Stack

### Frontend — `deployguard/`

| Technology | Purpose |
|:-----------|:--------|
| **Next.js 16** (App Router) | React framework with SSR, API routes, and file-based routing |
| **React 19** | UI component library with hooks and concurrent features |
| **TypeScript 5** | Type-safe development across the entire frontend |
| **Framer Motion** | Smooth page transitions, micro-animations, and UI interactions |
| **Recharts** | Interactive data visualization charts and graphs |
| **Lucide React** | Premium SVG icon library |
| **TanStack React Query** | Server state management, caching, and mutation hooks |
| **Supabase JS** | PostgreSQL database client, authentication, and real-time subscriptions |
| **Zod** | Runtime schema validation for API payloads |
| **CSS + PostCSS** | Custom design system with CSS variables, glassmorphism, and dark mode |

### Backend ML Service — `ml-service/`

| Technology | Purpose |
|:-----------|:--------|
| **Python 3.11+** | ML service runtime |
| **FastAPI** | High-performance async API framework with auto-generated docs |
| **Pydantic v2** | Request/response data validation and serialization |
| **Uvicorn** | ASGI server for production-grade deployment |
| **Ensemble Heuristic Model** | XGBoost-style risk scoring with weighted multi-factor analysis |

### Infrastructure & Services

| Technology | Purpose |
|:-----------|:--------|
| **Supabase** | PostgreSQL database, authentication, edge functions |
| **Vercel** | Frontend deployment with edge network and serverless functions |
| **Render** | ML service deployment with auto-scaling |
| **GitHub** | Source control and CI/CD triggers |

---

## 📁 Project Structure

```
AegisOps/
├── README.md                          # ← You are here
├── .gitignore
│
├── deployguard/                       # 🖥️ Next.js Frontend Application
│   ├── app/                           # App Router pages & API routes
│   │   ├── page.tsx                   # Dashboard home (command center)
│   │   ├── layout.tsx                 # Root layout with providers
│   │   ├── globals.css                # Design system & CSS variables
│   │   │
│   │   ├── api/                       # Next.js API route handlers
│   │   │   ├── predict/route.ts       #   → Proxy to ML /predict endpoint
│   │   │   ├── simulate/route.ts      #   → Proxy to ML /simulate endpoint
│   │   │   ├── alerts/route.ts        #   → Alert management
│   │   │   ├── deployments/route.ts   #   → Deployment data
│   │   │   ├── health/route.ts        #   → Health check
│   │   │   ├── incidents/route.ts     #   → Incident management
│   │   │   └── metrics/route.ts       #   → Metrics aggregation
│   │   │
│   │   ├── predictor/page.tsx         # 🔮 AI Failure Predictor (XAI + SHAP)
│   │   ├── simulator/page.tsx         # 🧬 Digital Twin Simulator
│   │   ├── copilot/page.tsx           # 🤖 AI DevOps Copilot
│   │   ├── root-cause/page.tsx        # 🔍 Root Cause Analysis
│   │   ├── security/page.tsx          # 🔒 Security & Vulnerabilities
│   │   ├── incidents/page.tsx         # 🚨 Incident Management
│   │   ├── infrastructure/page.tsx    # 🏗️ Infrastructure Observability
│   │   ├── dora/page.tsx              # 📈 DORA Metrics
│   │   ├── chaos/page.tsx             # ⚡ Chaos Engineering
│   │   ├── cicd/page.tsx              # 🔄 CI/CD Pipeline Analytics
│   │   ├── cloud/page.tsx             # ☁️ Cloud Management
│   │   ├── cost/page.tsx              # 💰 Cost Optimization
│   │   ├── dependency-graph/page.tsx  # 🕸️ Service Dependency Graph
│   │   ├── digital-twin/page.tsx      # 🪞 Digital Twin Overview
│   │   ├── executive/page.tsx         # 📋 Executive Dashboard
│   │   ├── health/page.tsx            # 💚 Health Overview
│   │   ├── integrations/page.tsx      # 🔗 Third-party Integrations
│   │   ├── log-intel/page.tsx         # 📝 Log Intelligence
│   │   ├── outage/page.tsx            # ⚠️ Outage Prediction
│   │   ├── rollback/page.tsx          # ↩️ Rollback Automation
│   │   ├── sre/page.tsx               # 🎯 SRE Dashboard
│   │   ├── team-insights/page.tsx     # 👥 Team Insights
│   │   └── auth/                      # 🔐 Authentication pages
│   │
│   ├── components/                    # Reusable UI components
│   │   ├── AppShell.tsx               #   Page layout wrapper
│   │   ├── Sidebar.tsx                #   Navigation sidebar
│   │   ├── TopNav.tsx                 #   Top navigation bar
│   │   ├── GaugeChart.tsx             #   Animated gauge visualization
│   │   ├── AnimatedBar.tsx            #   Animated progress bars
│   │   ├── MetricCard.tsx             #   Metric display cards
│   │   ├── RiskBadge.tsx              #   Risk level indicators
│   │   ├── LogViewer.tsx              #   Log display component
│   │   ├── Providers.tsx              #   React Query + Theme providers
│   │   └── ThemeToggle.tsx            #   Dark/light mode switch
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts                 #   Authentication state management
│   │   ├── useDeployments.ts          #   Deployment data fetching
│   │   ├── useIncidents.ts            #   Incident data management
│   │   ├── useLiveMetrics.ts          #   Real-time metric streaming
│   │   ├── useMetrics.ts              #   Historical metrics
│   │   ├── usePrediction.ts           #   ML prediction mutations
│   │   ├── useIntegrations.ts         #   Integration status
│   │   └── useSupabaseStatus.ts       #   Database connection check
│   │
│   ├── services/                      # API client service layer
│   │   ├── predictions.ts             #   ML prediction API calls
│   │   ├── deployments.ts             #   Deployment CRUD operations
│   │   ├── incidents.ts               #   Incident API calls
│   │   ├── metrics.ts                 #   Metrics API calls
│   │   ├── alerts.ts                  #   Alert management
│   │   ├── logs.ts                    #   Log fetching
│   │   ├── observability.ts           #   Observability data
│   │   ├── vulnerabilities.ts         #   Security scanning
│   │   └── integrations.ts            #   Integration management
│   │
│   ├── lib/                           # Shared utilities & engines
│   │   ├── supabase.ts                #   Supabase client initialization
│   │   ├── copilot-engine.ts          #   AI Copilot knowledge engine
│   │   ├── constants.ts               #   App-wide constants
│   │   ├── utils.ts                   #   Helper utilities
│   │   ├── validations.ts             #   Zod schemas
│   │   ├── rbac.ts                    #   Role-based access control
│   │   └── api-auth.ts                #   API authentication helpers
│   │
│   ├── types/                         # TypeScript type definitions
│   ├── middleware.ts                   # Next.js middleware (auth, routing)
│   ├── package.json                   # Node.js dependencies
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── next.config.ts                 # Next.js configuration
│   └── .env                           # Environment variables (not committed)
│
└── ml-service/                        # 🧠 Python ML Prediction Service
    ├── main.py                        # FastAPI app with /predict & /simulate
    └── requirements.txt               # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.11
- **npm** or **yarn**
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/HIYA-Banerjee/AegisOps.git
cd AegisOps
```

### 2. Set up the ML service

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The ML API will be available at `http://localhost:8000`.  
Verify with: `curl http://localhost:8000/health`

### 3. Set up the frontend

```bash
cd deployguard
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `deployguard/` directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ML Service
PYTHON_ML_SERVICE_URL=http://localhost:8000

# Optional: For production, point to your Render deployment
# PYTHON_ML_SERVICE_URL=https://your-ml-service.onrender.com
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AegisOps Platform                        │
├─────────────────────────────┬───────────────────────────────────┤
│     Frontend (Vercel)       │       ML Service (Render)         │
│                             │                                   │
│  ┌───────────────────────┐  │  ┌─────────────────────────────┐  │
│  │   Next.js 16 (React)  │  │  │   FastAPI (Python 3.11+)    │  │
│  │                       │  │  │                             │  │
│  │  ┌─────────────────┐  │  │  │  ┌───────────────────────┐  │  │
│  │  │  App Router      │  │  │  │  │  /predict endpoint    │  │  │
│  │  │  (22 pages)      │──┼──┼──┤  │  Ensemble ML scoring  │  │  │
│  │  └─────────────────┘  │  │  │  └───────────────────────┘  │  │
│  │                       │  │  │                             │  │
│  │  ┌─────────────────┐  │  │  │  ┌───────────────────────┐  │  │
│  │  │  API Routes      │  │  │  │  │  /simulate endpoint   │  │  │
│  │  │  (7 endpoints)   │──┼──┼──┤  │  Chaos simulation     │  │  │
│  │  └─────────────────┘  │  │  │  └───────────────────────┘  │  │
│  │                       │  │  │                             │  │
│  │  ┌─────────────────┐  │  │  │  ┌───────────────────────┐  │  │
│  │  │  AI Copilot      │  │  │  │  │  /health endpoint     │  │  │
│  │  │  Engine          │  │  │  │  │  Service monitoring    │  │  │
│  │  └─────────────────┘  │  │  │  └───────────────────────┘  │  │
│  └───────────────────────┘  │  └─────────────────────────────┘  │
│             │               │                                   │
│             ▼               │                                   │
│  ┌───────────────────────┐  │                                   │
│  │   Supabase            │  │                                   │
│  │   (PostgreSQL + Auth) │  │                                   │
│  └───────────────────────┘  │                                   │
└─────────────────────────────┴───────────────────────────────────┘
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Set the **Root Directory** to `deployguard`
4. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `PYTHON_ML_SERVICE_URL` → your Render ML service URL

### ML Service → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Set the **Root Directory** to `ml-service`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy and copy the service URL

---

## 🧪 API Endpoints

### ML Service API

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/health` | Health check — returns `{ status: "ok" }` |
| `POST` | `/predict` | Predict deployment failure risk with SHAP values |
| `POST` | `/simulate` | Run chaos simulation on digital twin |

### Next.js API Routes

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/predict` | Proxy to ML `/predict` |
| `POST` | `/api/simulate` | Proxy to ML `/simulate` |
| `GET` | `/api/health` | App health status |
| `GET` | `/api/deployments` | Fetch deployment data |
| `GET` | `/api/incidents` | Fetch incident data |
| `GET` | `/api/metrics` | Fetch system metrics |
| `GET` | `/api/alerts` | Fetch active alerts |

---

## 🎨 Design System

AegisOps uses a custom dark-mode-first design system built with CSS variables:

- **Color palette**: Curated HSL colors with cyan, purple, red, orange, and green accents
- **Glassmorphism**: Semi-transparent cards with backdrop blur effects
- **Micro-animations**: Framer Motion transitions on every interactive element
- **Typography**: JetBrains Mono (monospace) + Inter (sans-serif)
- **Responsive**: Fully responsive grid layouts across all screen sizes

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [HIYA Banerjee](https://github.com/HIYA-Banerjee)**

⭐ Star this repo if you find it useful!

</div>
