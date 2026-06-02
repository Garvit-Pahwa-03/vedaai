# VedaAI — AI Assessment Creator

A full-stack AI-powered assessment creation platform that allows teachers to create assignments, generate structured question papers using AI, and view formatted output with difficulty tagging and answer keys.

**Live Demo:** https://vedaai-seven.vercel.app  
**Backend API:** https://vedaai-api-ptok.onrender.com

---

## Architecture Overview

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
| MongoDB + Mongoose | Assignments, users, and generated papers storage |
| Upstash Redis | Serverless Redis for job state and caching |
| BullMQ | Background job queue for AI generation |
| WebSocket (ws) | Real-time push notifications to frontend |
| Multer | File upload handling |
| Groq SDK | LLM API (llama-3.3-70b-versatile) |
| JWT + bcryptjs | Authentication and password hashing |

---

## Features

### Core
- **JWT Authentication** — Signup and signin with per-user data isolation
- **Assignment Creation** — File upload (PDF/image), due date, school name, subject, class, multiple question types with configurable counts and marks, additional instructions
- **AI Question Generation** — Structured prompt engineering → LLM → parsed JSON (never renders raw AI response)
- **File-Based Questions** — Upload PDF or text files; questions are generated based on the actual file content
- **Real-time Updates** — WebSocket notifies frontend when generation completes
- **Structured Output** — Questions grouped into sections (A, B, C), each with difficulty badges (Easy / Moderate / Hard) and marks
- **Answer Key** — Auto-generated answer key displayed below question paper
- **Student Info Section** — Name, Roll Number, Section fields on output page
- **Form Validation** — No empty fields, no negative values, due date required
- **Per-User Isolation** — Each user sees only their own assignments

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
├── README.md
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts            # MongoDB connection
│   │   │   └── redis.ts               # Upstash Redis connection
│   │   ├── controllers/
│   │   │   ├── assignmentController.ts
│   │   │   └── authController.ts      # Signup, signin
│   │   ├── middleware/
│   │   │   └── auth.ts                # JWT auth middleware
│   │   ├── models/
│   │   │   ├── Assignment.ts          # Assignment schema (with userId)
│   │   │   ├── GeneratedPaper.ts      # Paper schema
│   │   │   └── User.ts                # User schema
│   │   ├── queues/
│   │   │   └── assignmentQueue.ts     # BullMQ queue setup
│   │   ├── routes/
│   │   │   ├── assignmentRoutes.ts    # Protected by auth middleware
│   │   │   └── authRoutes.ts          # Public auth routes
│   │   ├── services/
│   │   │   ├── aiService.ts           # Groq LLM + prompt builder
│   │   │   └── websocketManager.ts
│   │   ├── workers/
│   │   │   └── assignmentWorker.ts    # BullMQ worker + PDF extraction
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
    │   ├── signin/page.tsx            # Sign in page
    │   ├── signup/page.tsx            # Sign up page
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.tsx        # Desktop sidebar with logout
    │   │   │   ├── TopBar.tsx         # Top bar with user info + logout
    │   │   │   ├── BottomNav.tsx      # Mobile bottom navigation
    │   │   │   └── AuthInitializer.tsx # Auth guard + redirect logic
    │   │   ├── assignments/
    │   │   │   └── AssignmentCard.tsx
    │   │   └── icons/
    │   │       └── NoAssignmentsIcon.tsx
    │   ├── layout.tsx
    │   └── globals.css
    ├── store/
    │   ├── assignmentStore.ts         # Zustand store for assignments
    │   └── authStore.ts               # Zustand store for auth state
    ├── lib/
    │   ├── api.ts                     # Axios instance with JWT interceptor
    │   └── useWebSocket.ts
    ├── types/
    │   └── index.ts
    └── .env.local
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Upstash account (free tier at upstash.com)
- Groq API key (free at console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/Garvit-Pahwa-03/vedaai.git
cd vedaai
```

### 2. Set up Upstash Redis

1. Go to [console.upstash.com](https://console.upstash.com)
2. Create a new Redis database → select a region
3. Copy the **Redis URL** (starts with `rediss://`) for BullMQ

### 3. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vedaai
UPSTASH_REDIS_URL=rediss://your-upstash-redis-url
GROQ_API_KEY=gsk_your_key_here
JWT_SECRET=your_long_random_secret_here
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

Open http://localhost:3000 — you will be redirected to `/signin` automatically.

---

## Auth Flow

1. User visits any protected route → redirected to `/signin`
2. New users go to `/signup` → enter first name, last name, email, password → account created instantly
3. JWT token stored in localStorage → redirected to `/assignments`
4. All subsequent API requests include `Authorization: Bearer <token>` header
5. Each user only sees their own assignments (filtered by `userId` in MongoDB)
6. Token expiry (7 days) → auto redirect to `/signin`

---

## API Reference

### Auth (Public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register → returns JWT token immediately |
| `POST` | `/api/auth/signin` | Sign in → returns JWT token |
| `GET` | `/api/auth/me` | Get current user (requires token) |

### Assignments (Protected — requires JWT)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/assignments` | Create assignment + trigger generation |
| `GET` | `/api/assignments` | List user's assignments |
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

- School name, subject, class (from user input — not hardcoded)
- Exact question counts and marks per type
- Section grouping (Section A, B, C per question type)
- Difficulty distribution (40% easy, 40% moderate, 20% hard)
- Complete answer key for every question
- Reference material extracted from uploaded files (PDF text extraction via pdf-parse)

The response is then:
1. Stripped of any accidental markdown fences
2. Parsed with `JSON.parse()`
3. Saved to MongoDB as a structured `GeneratedPaper` document
4. Rendered section by section — raw LLM text is never displayed

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://vedaai-seven.vercel.app |
| Backend API + Worker | Render | https://vedaai-api-ptok.onrender.com |
| Database | MongoDB Atlas | Cloud |
| Cache / Job State | Upstash Redis | Serverless Cloud |

---

## Environment Variables Reference

### Backend

| Variable | Description |
|---|---|
| `PORT` | Server port (default 4000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `UPSTASH_REDIS_URL` | Upstash Redis URL (rediss://) |
| `GROQ_API_KEY` | Groq API key |
| `JWT_SECRET` | Long random string for JWT signing |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL (wss:// in production) |
