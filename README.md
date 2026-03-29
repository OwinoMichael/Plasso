# Plasso CodeSync — Real-Time Collaborative Code Editor

> A full-stack, production-grade collaborative code editor with AI-powered code review, real-time multi-user synchronization, and cloud code execution.

🌐 **[Live Demo](https://mikeowino.cloud/plasso)** · 💻 **[GitHub](https://github.com/OwinoMichael/Plasso)**

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Production Deployment](#production-deployment)
- [Docker & Containerization](#docker--containerization)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Integrations](#api-integrations)
- [Database](#database)
- [Authentication](#authentication)
- [AI Code Review](#ai-code-review)
- [Code Execution](#code-execution)
- [WebSocket Communication](#websocket-communication)
- [Contributing](#contributing)

---

## Overview

**Plasso CodeSync** is a real-time collaborative code editor designed for distributed development teams. Multiple users can edit the same code file simultaneously, with changes propagated instantly via WebSocket. An integrated AI engine (powered by Gemini, Claude, and LLaMA) reviews code as it's written, providing inline suggestions, warnings, and best-practice recommendations.

The application is fully containerized and deployed on a DigitalOcean Droplet using Docker Compose, with an automated CI/CD pipeline via GitHub Actions.

---

## Features

- **Real-Time Collaborative Editing** — Multiple users edit the same file simultaneously with sub-second synchronization via WebSocket (STOMP over SockJS).
- **AI-Powered Code Review** — Inline suggestions, warnings, and best-practice recommendations powered by Google Gemini 2.0 Flash, Anthropic Claude API, and Meta LLaMA.
- **Cloud Code Execution** — Run code in 40+ languages directly in the browser via Judge0 CE (RapidAPI hosted sandbox).
- **Passwordless Authentication** — Magic link email verification + JWT session management. No passwords to manage.
- **Role-Based Workspace Access** — PostgreSQL-backed project workspaces with per-user access control.
- **Persistent Collaborative Sessions** — Sessions survive page reloads and reconnects.
- **Production-Ready Deployment** — Fully containerized with health checks, restart policies, and automated deploy pipelines.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Vite | 5.x | Build tool & dev server |
| Nginx | alpine | Static file serving in production |
| WebSocket (SockJS + STOMP) | — | Real-time communication |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 (Eclipse Temurin) | Runtime |
| Spring Boot | 3.x | Application framework |
| Spring WebSocket | — | WebSocket server (STOMP broker) |
| Spring Security | — | Authentication & authorization |
| Spring Mail | — | Magic link email delivery |
| Spring Data JPA / Hibernate | — | ORM & database abstraction |
| Maven | 3.9.9 | Build & dependency management |

### Database

| Technology | Version | Purpose |
|---|---|---|
| PostgreSQL | (via pgvector image) | Primary relational database |
| pgvector | latest (ankane image) | Vector extension (AI embedding support) |

### Infrastructure & DevOps

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| GitHub Actions | CI/CD pipeline |
| DigitalOcean Droplet | Cloud VPS hosting |
| Nginx (alpine) | Reverse proxy / static serving |

### AI & External APIs

| Service | Purpose |
|---|---|
| Google Gemini 2.0 Flash | Primary AI code review engine |
| Anthropic Claude API | Secondary AI code review / analysis |
| Meta LLaMA | Tertiary / offline AI model |
| Judge0 CE (RapidAPI) | Sandboxed multi-language code execution |
| Gmail SMTP | Transactional email (magic link auth) |

### Authentication

| Mechanism | Details |
|---|---|
| Passwordless / Magic Link | Email-based one-time login links |
| JWT (JSON Web Tokens) | Session management, configurable expiry |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Docker Host (VPS)                  │
│                                                     │
│  ┌──────────────────┐       ┌────────────────────┐  │
│  │  React (Nginx)   │──────▶│  Spring Boot API   │  │
│  │  Port 3003:80    │  HTTP │  Port 8082:8080     │  │
│  └──────────────────┘       └────────┬───────────┘  │
│                                      │              │
│                             ┌────────▼───────────┐  │
│                             │  PostgreSQL (pg-   │  │
│                             │  vector) :5432     │  │
│                             └────────────────────┘  │
│                                                     │
│         All services on: app-network (bridge)       │
└─────────────────────────────────────────────────────┘
              │                        │
              ▼                        ▼
    External: Judge0 API       External: Gemini /
    (code execution)           Claude / LLaMA APIs
```

- The **React frontend** is built as a static bundle and served by Nginx on port 3003.
- The **Spring Boot backend** exposes REST and WebSocket endpoints on port 8082 (mapped internally to 8080).
- **PostgreSQL** (with the pgvector extension) is only accessible internally within the Docker network — no external port binding in production.
- All inter-service communication uses the internal `app-network` bridge.

---

## Project Structure

```
Plasso/
├── frontend-react/                # React + TypeScript frontend
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Route-level pages
│   │   ├── hooks/                 # Custom React hooks (WebSocket, auth, etc.)
│   │   ├── services/              # API service layer
│   │   └── types/                 # TypeScript type definitions
│   ├── nginx/
│   │   └── default.conf           # Nginx config for production
│   ├── Dockerfile                 # Multi-stage: Node build → Nginx serve
│   ├── tsconfig.app.json
│   └── vite.config.ts
│
├── backend-spring/                # Java Spring Boot backend
│   ├── src/main/java/
│   │   └── ...                    # Controllers, Services, Repositories, Config
│   ├── src/main/resources/
│   │   ├── application.properties # Main config (uses env vars)
│   │   └── application-prod.properties
│   ├── pom.xml                    # Maven dependencies
│   └── Dockerfile                 # Multi-stage: Maven build → JRE runtime
│
├── docker-compose.prod.yml        # Production Docker Compose
├── docker-compose.yml             # Local/dev Docker Compose (if present)
└── .github/
    └── workflows/
        └── deploy.yml             # GitHub Actions CI/CD
```

---

## Environment Variables

Create a `.env` file in the project root (never commit this file).

### Database

| Variable | Description | Example |
|---|---|---|
| `DB_USER` | PostgreSQL username | `plasso_user` |
| `DB_PASS` | PostgreSQL password | `supersecretpassword` |
| `DB_NAME` | PostgreSQL database name | `plasso` |

### Backend (Spring Boot)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `https://api.mikeowino.cloud` |
| `FRONTEND_URL` | Frontend origin (CORS) | `https://mikeowino.cloud` |
| `WS_URL` | WebSocket base URL | `wss://api.mikeowino.cloud/ws` |
| `JWT_SECRET` | Secret key for signing JWTs | `a-long-random-string` |
| `JWT_EXPIRATION_MS` | JWT TTL in milliseconds | `604800000` (7 days) |
| `MAIL_USER` | Gmail address for sending emails | `yourapp@gmail.com` |
| `MAIL_PASS` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `JUDGE0_API_KEY` | RapidAPI key for Judge0 CE | `your-rapidapi-key` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |

### Frontend (Vite build args)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | API base URL baked into frontend build | `https://api.mikeowino.cloud` |
| `VITE_WS_URL` | WebSocket URL baked into frontend build | `wss://api.mikeowino.cloud/ws` |

### GitHub Secrets (CI/CD)

| Secret | Description |
|---|---|
| `DROPLET_IP` | IP address of the DigitalOcean Droplet |
| `DROPLET_SSH_KEY` | Private SSH key for Droplet access |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v24+) and [Docker Compose](https://docs.docker.com/compose/) (v2+)
- [Node.js](https://nodejs.org/) 20+ (for local frontend development without Docker)
- [Java 21](https://adoptium.net/) + [Maven 3.9+](https://maven.apache.org/) (for local backend development without Docker)
- A RapidAPI account with Judge0 CE enabled
- A Google Cloud project with Gemini API enabled
- A Gmail account with an app password configured

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/OwinoMichael/Plasso.git
   cd Plasso
   ```

2. **Create a `.env` file** in the project root (see [Environment Variables](#environment-variables)).

3. **Start all services with Docker Compose**
   ```bash
   docker compose -f docker-compose.prod.yml up --build
   ```

4. **Access the app**
   - Frontend: http://localhost:3003
   - Backend API: http://localhost:8082
   - Spring Actuator health: http://localhost:8082/actuator/health

5. **Frontend-only dev (with hot reload)**
   ```bash
   cd frontend-react
   npm install
   npm run dev
   # Runs on http://localhost:5173 by default
   ```

6. **Backend-only dev**
   ```bash
   cd backend-spring
   mvn spring-boot:run
   # Runs on http://localhost:8080 by default
   ```
   Make sure PostgreSQL is running locally and update `application.properties` with your local DB credentials (commented-out lines are provided).

### Production Deployment

Production deployment is fully automated via GitHub Actions on every push to `main`. See [CI/CD Pipeline](#cicd-pipeline).

To deploy manually on the VPS:

```bash
cd /root/projects/Plasso
git pull origin main
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f
```

---

## Docker & Containerization

The project uses a three-container setup orchestrated by `docker-compose.prod.yml`.

### Services

#### `db` — PostgreSQL with pgvector
- Image: `ankane/pgvector:latest`
- Internal port only (`5432` exposed to the Docker network, not the host)
- Health check: `pg_isready` with 5 retries and a 40s start period
- Data persisted in a named Docker volume (`pgdata_prod`)
- Restart policy: `always`

#### `spring` — Spring Boot API
- Built from `./backend-spring/Dockerfile`
- Multi-stage: Maven 3.9.9 + Eclipse Temurin 21 build → Eclipse Temurin 21 JRE alpine runtime
- Health check: polls `/actuator/health` via `wget`
- Depends on `db` with `service_healthy` condition
- Port mapping: `8082:8080`
- Restart policy: `always`

#### `react` — React Frontend
- Built from `./frontend-react/Dockerfile`
- Multi-stage: Node 20 alpine build → Nginx alpine serve
- Build args `VITE_API_URL` and `VITE_WS_URL` are baked in at build time
- Depends on `spring`
- Port mapping: `3003:80`
- Restart policy: `always`

### Networks & Volumes

```yaml
networks:
  app-network:        # bridge network — all services communicate internally

volumes:
  pgdata_prod:        # PostgreSQL data persistence
  nginx_logs:         # Nginx log persistence
```

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers on every push to the `main` branch.

### Pipeline Steps

1. SSH into the DigitalOcean Droplet using `appleboy/ssh-action@v1.2.0`
2. Pull the latest code from `main`
3. Stop existing containers (`docker compose down`)
4. Rebuild and restart all containers (`docker compose up -d --build`)
5. Prune dangling Docker images (`docker image prune -f`)

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `DROPLET_IP` | Public IP of the VPS |
| `DROPLET_SSH_KEY` | RSA/ED25519 private key for SSH access |

The `.env` file must already exist on the server at `/root/projects/Plasso/.env` — it is not uploaded by CI/CD.

---

## API Integrations

### Judge0 CE — Code Execution

- **Provider:** RapidAPI (hosted Judge0 CE instance)
- **Base URL:** `https://judge0-ce.p.rapidapi.com`
- **Host header:** `judge0-ce.p.rapidapi.com`
- **Auth:** RapidAPI key via `JUDGE0_API_KEY` env var
- **Capability:** Submit and execute code in 40+ languages in an isolated sandbox

### Google Gemini 2.0 Flash — AI Code Review

- **Base URL:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Auth:** `GEMINI_API_KEY` env var
- **Capability:** Primary AI engine for real-time inline code review, suggestions, and warnings

### Anthropic Claude API — AI Code Review

- **Model:** Claude (via standard Anthropic API)
- **Capability:** Secondary AI engine for code analysis and best-practice recommendations

### Meta LLaMA — AI Code Review

- **Capability:** Tertiary AI model for code review, used in conjunction with or as fallback to Gemini/Claude

### Gmail SMTP — Transactional Email

- **Host:** `smtp.gmail.com:587`
- **Auth:** STARTTLS with app password (`MAIL_USER` / `MAIL_PASS`)
- **Purpose:** Sending magic link authentication emails

---

## Database

### Engine

PostgreSQL with the **pgvector** extension (via `ankane/pgvector` Docker image), enabling storage and querying of vector embeddings for AI features.

### Schema Management

- **DDL mode:** `create-drop` (auto-creates tables on startup, drops on shutdown)
  > ⚠️ Change `spring.jpa.hibernate.ddl-auto` to `validate` or `update` for stable production data
- **ORM:** Hibernate / Spring Data JPA
- **Dialect:** `org.hibernate.dialect.PostgreSQLDialect`

### Key Schema Concepts

- **Project Workspaces** — Each workspace has associated users with role-based access control
- **Collaborative Sessions** — Track active editors per file/session
- **User Accounts** — Email-based identity with JWT session state
- **Vector columns** (via pgvector) — For AI embedding storage

---

## Authentication

Plasso uses a **passwordless magic link** flow:

1. User enters their email address
2. Backend generates a signed, time-limited token and sends a magic link via Gmail SMTP
3. User clicks the link; backend validates the token and issues a **JWT**
4. The JWT is stored client-side and sent with every subsequent request
5. JWT expiry defaults to **7 days** (`604800000 ms`) but is configurable via `JWT_EXPIRATION_MS`

### JWT Configuration

```properties
jwt.secret=${JWT_SECRET}
jwt.expiration.ms=${JWT_EXPIRATION:604800000}
```

The `JWT_SECRET` should be a long, random, cryptographically secure string.

---

## AI Code Review

The AI review system processes code in real time as users type, providing:

- **Inline suggestions** — Style and readability improvements
- **Warnings** — Potential bugs, anti-patterns, security concerns
- **Best-practice recommendations** — Language-specific idioms and patterns

### Model Cascade

| Priority | Model | Use Case |
|---|---|---|
| 1 | Google Gemini 2.0 Flash | Fast, low-latency real-time review |
| 2 | Anthropic Claude API | Deeper analysis, complex review |
| 3 | Meta LLaMA | Fallback / offline capability |

Reported **40% reduction in code review time** through automated AI feedback.

---

## Code Execution

Code execution is powered by **Judge0 CE** via the RapidAPI gateway:

- Users can run their code directly in the browser
- Supports 40+ languages including Python, JavaScript, Java, C++, Go, Rust, and more
- Execution happens in an isolated sandbox — no code runs on the application server
- Results (stdout, stderr, runtime, memory) are returned and displayed inline

---

## WebSocket Communication

Real-time collaboration is built on **Spring WebSocket** with the STOMP sub-protocol over SockJS:

- **Backend:** Spring `@EnableWebSocketMessageBroker` with an in-memory STOMP message broker
- **Frontend:** SockJS client + STOMP.js
- **URL:** Configured via `WS_URL` / `VITE_WS_URL` env vars
- Users subscribe to a shared topic per session/file; edits are broadcast to all subscribers
- Supports multi-user cursor and selection tracking

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request against `main`

Please follow existing code conventions and include tests where applicable.

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

*Built by [Michael Owino](https://mikeowino.cloud)*
