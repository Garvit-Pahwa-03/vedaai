# VedaAI — AI Assessment Creator

A full-stack AI-powered assessment creation platform that allows teachers to create assignments, generate structured question papers using AI, and view formatted output with difficulty tagging and answer keys.

**Live Demo:** https://vedaai-frontend.vercel.app  
**Backend API:** https://vedaai-api-ptok.onrender.com

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│         Zustand · WebSocket · Tailwind CSS              │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP + WebSocket
┌────────────────────────▼────────────────────────────────┐
│                  Express API Server                      │
│              Node.js · TypeScript · CORS                │
└──────┬──────────────────┬──────────────────┬────────────┘
       │                  │                  │
┌──────▼──────┐  ┌────────▼───────┐  ┌──────▼──────┐
│   MongoDB   │  │     Redis      │  │   BullMQ    │
│ Assignments │  │ Cache · State  │  │   Workers   │
│   Papers    │  │                │  │             │
└─────────────┘  └────────────────┘  └──────┬──────┘
                                            │
                                   ┌────────▼───────┐
                                   │   Groq LLM     │
                                   │ llama-3.3-70b  │
                                   └────────────────┘
```

### Request Flow

1. Teacher fills out assignment form on frontend
2. `POST /api/assignments` creates MongoDB document + adds BullMQ job
3. BullMQ worker picks up job → builds structured prompt → calls Groq LLM
4. LLM response is parsed and validated into structured JSON
5. Generated paper saved to MongoDB → Assignment status updated to `completed`
6. WebSocket notifies frontend in real time
7. Frontend fetches and renders the structured question paper

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 14 + TypeScript | App framework with App Router |
| Tailwind CSS v3 | Styling and responsive design |
| Zustand | Global state management |
| Axios | HTTP API calls |
| WebSocket (native) | Real-time job status updates |
| date-fns | Date formatting |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express + TypeScript | API server |
| MongoDB + Mongoose | Assignments and generated papers storage |
| Redis (ioredis) | Job state caching |
| BullMQ | Background job queue for AI generation |
| WebSocket (ws) | Real-time push notifications to frontend |
| Multer | File upload handling |
| Groq SDK | LLM API (llama-3.3-70b-versatile) |

---

## Features

### Core
- **Assignment Creation** — File upload, due date, multiple question types with configurable counts and marks, additional instructions
- **AI Question Generation** — Structured prompt engineering → LLM → parsed JSON (never renders raw AI response)
- **Real-time Updates** — WebSocket notifies frontend when generation completes
- **Structured Output** — Questions grouped into sections (A, B, C), each with difficulty badges (Easy / Moderate / Hard) and marks
- **Answer Key** — Auto-generated answer key displayed below question paper
- **Student Info Section** — Name, Roll Number, Section fields on output page
- **Form Validation** — No empty fields, no negative values, due date required

### Bonus
- **Download as PDF** — Browser print with CSS print media queries isolating only the paper
- **Difficulty Badges** — Color-coded tags (green = easy, yellow = moderate, red = hard)
- **Mobile Responsive** — Bottom navigation bar, collapsible sidebar, responsive layouts for all screen sizes
- **Upcoming Assignments Badge** — Sidebar shows count of assignments with future due dates
- **Background Job Processing** — Generation runs in a separate worker process via BullMQ, keeping API responsive

---

## Project Structure

```
vedaai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts            # MongoDB connection
│   │   │   └── redis.ts               # Redis connection
│   │   ├── controllers/
│   │   │   └── assignmentController.ts
│   │   ├── models/
│   │   │   ├── Assignment.ts          # Assignment schema
│   │   │   └── GeneratedPaper.ts      # Paper schema
│   │   ├── queues/
│   │   │   └── assignmentQueue.ts     # BullMQ queue setup
│   │   ├── routes/
│   │   │   └── assignmentRoutes.ts
│   │   ├── services/
│   │   │   ├── aiService.ts           # Groq LLM + prompt builder
│   │   │   └── websocketManager.ts
│   │   ├── workers/
│   │   │   └── assignmentWorker.ts    # BullMQ worker
│   │   └── index.ts                   # Express server entry
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── assignments/
    │   │   ├── page.tsx               # Assignments list
    │   │   ├── create/page.tsx        # Create assignment form
    │   │   └── [id]/page.tsx          # Generated paper output
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.tsx
    │   │   │   ├── TopBar.tsx
    │   │   │   ├── BottomNav.tsx
    │   │   │   └── StoreInitializer.tsx
    │   │   ├── assignments/
    │   │   │   └── AssignmentCard.tsx
    │   │   └── icons/
    │   │       └── NoAssignmentsIcon.tsx
    │   ├── layout.tsx
    │   └── globals.css
    ├── store/
    │   └── assignmentStore.ts         # Zustand store
    ├── lib/
    │   ├── api.ts
    │   └── useWebSocket.ts
    ├── types/
    │   └── index.ts
    └── .env.local
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- Docker Desktop (for Redis)
- MongoDB Atlas account (free tier works)
- Groq API key (free at console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/vedaai.git
cd vedaai
```

### 2. Start Redis

```bash
docker run -d --name vedaai-redis -p 6379:6379 redis:alpine
```

### 3. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vedaai
REDIS_HOST=localhost
REDIS_PORT=6379
GROQ_API_KEY=gsk_your_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start API server and worker in separate terminals:

```bash
# Terminal 1 — API server
npm run dev

# Terminal 2 — BullMQ worker
npm run dev:worker
```

### 4. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
```

Start frontend:

```bash
npm run dev
```

Open http://localhost:3000

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/assignments` | Create assignment + trigger generation |
| `GET` | `/api/assignments` | List all assignments |
| `GET` | `/api/assignments/:id` | Get single assignment |
| `DELETE` | `/api/assignments/:id` | Delete assignment |
| `GET` | `/api/assignments/:id/paper` | Get generated paper |

### WebSocket Events

**Client → Server:**
```json
{ "type": "subscribe", "assignmentId": "abc123" }
```

**Server → Client:**
```json
{ "type": "processing", "status": "processing", "assignmentId": "abc123" }
{ "type": "completed", "status": "completed", "paperId": "xyz", "assignmentId": "abc123" }
{ "type": "failed", "status": "failed", "error": "...", "assignmentId": "abc123" }
```

---

## AI Prompt Approach

The system converts form input into a structured prompt that instructs the LLM to return **only valid JSON** — never markdown or prose. The prompt specifies:

- Exact question counts and marks per type
- Section grouping (Section A, B, C per question type)
- Difficulty distribution (40% easy, 40% moderate, 20% hard)
- Complete answer key for every question
- School name, subject, class, time allowed

The response is then:
1. Stripped of any accidental markdown fences
2. Parsed with `JSON.parse()`
3. Saved to MongoDB as a structured `GeneratedPaper` document
4. Rendered section by section — raw LLM text is never displayed

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://vedaai-frontend.vercel.app |
| Backend API + Worker | Render | https://vedaai-api-ptok.onrender.com |
| Database | MongoDB Atlas | Cloud |
| Cache | Redis (Render) | Internal |

---

## Environment Variables Reference

### Backend

| Variable | Description |
|---|---|
| `PORT` | Server port (default 4000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `GROQ_API_KEY` | Groq API key |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL (wss:// in production) |
