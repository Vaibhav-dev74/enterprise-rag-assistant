# 🏢 Enterprise RAG Assistant

> **Next-Generation, Privacy-First Enterprise Multi-Document Intelligence & Retrieval Platform**  
> Powered by **FastAPI**, **LangChain**, **ChromaDB**, **Ollama (`qwen2.5:7b`)**, **React 19**, **Vite**, and **Tailwind CSS**.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Ollama](https://img.shields.io/badge/Ollama-qwen2.5%3A7b-black.svg?style=flat&logo=ollama&logoColor=white)](https://ollama.com)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-orange.svg?style=flat)](https://trychroma.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Overview

**Enterprise RAG Assistant** is a self-hosted, enterprise-grade AI knowledge workspace. It enables teams and organizations to upload, chunk, index, and query complex PDF documents with 100% on-premise execution — no private documents or vectors ever leave your machine.

Equipped with per-user document isolation, 6-digit email verification security, multi-turn conversation memory, real-time PDF citation previews, and an ultra-responsive glassmorphic interface, Enterprise RAG delivers an intuitive and secure knowledge retrieval experience.

---

## 🏛️ Architecture

```mermaid
graph TD
    Client["React 19 Frontend (Vite + Tailwind CSS + Framer Motion)"]
    API["FastAPI Backend (REST API + JWT Auth + Static File Server)"]
    DB[(SQLite DB - Users, Sessions, History, Notifications)]
    Embeddings["Sentence Transformers (all-MiniLM-L6-v2)"]
    VectorDB[("ChromaDB Vector Store (Scoped by user_id)")]
    LLM["Local Ollama Engine (qwen2.5:7b)"]

    Client -->|HTTP / JSON / X-User-ID| API
    API -->|Auth / Query / Session Log| DB
    API -->|Chunk & Embed| Embeddings
    Embeddings -->|Store & Query Vectors| VectorDB
    VectorDB -->|Retrieved Chunks + Citations| API
    API -->|Context + Prompt + Dialogue History| LLM
    LLM -->|Streamed Answer| API
    API -->|Response + Sources + Citations| Client
```

---

## ✨ Key Features

### 🔒 Strict Per-User Document Isolation
- Multi-tenant architecture ensuring **users only see and query their own documents**.
- Files are isolated into dedicated per-user directories (`uploads/{user_id}/{filename}`).
- ChromaDB vector chunks and deletions are strictly filtered with `{"$and": [{"source": filename}, {"user_id": user_id}]}`.
- New users start with a clean slate and zero access to other users' indexed documents.

### 📧 Email Verification Security
- Registration flow with mandatory **6-digit email verification code** before login.
- Unverified accounts are protected with HTTP `403` guards and guided verification alerts.
- Dedicated interactive verification page (`/verify-email`) with one-click code resend and instant account activation.
- Password recovery flow with 6-digit recovery codes (`/forgot-password`).

### 🧠 100% Local On-Premise AI
- Powered by **Ollama (`qwen2.5:7b`)** running entirely offline on your hardware.
- Local embeddings generated via `sentence-transformers/all-MiniLM-L6-v2`.
- Complete data privacy: zero cloud dependencies, zero external LLM API costs, and zero external telemetry.

### 📄 Interactive PDF Workspace & Citation Viewer
- Real-time side-by-side or slide-over PDF document previewer powered by PDF.js.
- **Click-to-Page Citations**: Every AI response includes exact citations; clicking a citation jumps directly to that specific page in the PDF preview.
- Drag-and-drop document upload zone (`react-dropzone`) with automated chunking and vectorization.

### 💬 Context-Aware Conversational Intelligence
- Multi-turn dialogue history preserved across sessions.
- **Forget Context / Clear Memory**: Clear session history while keeping document index attached.
- In-chat slide-over conversation history drawer to switch between sessions instantly.
- One-click conversation export to GitHub-flavored Markdown (`.md`).
- Click-to-copy AI responses with instant checkmark feedback.

### 🎨 Modern Responsive UI / UX
- Sleek glassmorphism (`backdrop-blur-md`, refined dark/light themes).
- Fluid animations and micro-interactions powered by **Framer Motion**.
- Fully responsive across mobile (< 640px), tablet (< 1024px), laptop (< 1536px), and 2xl desktop.
- Touchscreen-friendly action buttons (no hover required on touch devices).
- Dedicated mobile navigation drawer and mobile "Docs" drawer.

### 🔔 Activity Notifications Center
- Real-time notification bell with dynamic unread count badge.
- Automatic alerts on document ingestion, vector processing, and security events.
- Filter notifications by category: All, Unread, Documents, Security.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 | Fast modern SPA architecture |
| **Build Tool** | Vite | Lightning-fast HMR and bundle compilation |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design + glassmorphism |
| **Motion** | Framer Motion | Smooth page transitions, modals, and slide-overs |
| **Icons** | Lucide React | High-quality minimalist iconography |
| **PDF Rendering** | React-PDF / PDF.js | Canvas-based in-browser document preview |
| **Backend API** | FastAPI | High-performance Python async framework |
| **RAG Orchestration** | LangChain | Document chunking, vector stores, and prompt chains |
| **Local LLM Engine** | Ollama | Local inference with `qwen2.5:7b` |
| **Vector Store** | ChromaDB | High-speed persistent vector database |
| **Embeddings** | HuggingFace / PyTorch | `all-MiniLM-L6-v2` dense vector representations |
| **Relational Database** | SQLite + SQLAlchemy | User authentication, chat logs, notifications |
| **Security** | Passlib (Bcrypt) + JWT | Secure password hashing & Bearer token authorization |

---

## 📁 Project Structure

```
enterprise-rag/
├── backend/
│   ├── app/
│   │   ├── auth/                # Hashing & JWT token handlers
│   │   ├── database/            # SQLite connection & table setup
│   │   ├── ingestion/           # PDF loader & recursive chunker
│   │   ├── models/              # SQLAlchemy models (User, ChatSession, History, Notifications)
│   │   ├── notifications/       # Activity notification dispatch service
│   │   ├── rag/                 # Ollama service, retriever & prompt templates
│   │   ├── routes/              # FastAPI endpoints (auth, chat, documents, history, notifications, upload)
│   │   ├── schemas/             # Pydantic validation schemas
│   │   └── vectorstore/         # ChromaDB client & vector operations
│   ├── uploads/                 # User-isolated PDF storage (e.g., uploads/{user_id}/)
│   ├── chroma_db/               # Persistent ChromaDB vector collections
│   ├── chat_history.db          # SQLite relational database
│   ├── requirements.txt         # Python dependencies
│   └── venv/                    # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios HTTP client & authentication API helpers
│   │   ├── components/
│   │   │   ├── auth/            # AuthLayout, LoginForm, RegisterForm
│   │   │   ├── chat/            # ChatBox, ChatInput, EmptyState, Message, Typing
│   │   │   ├── common/          # Navbar, Footer, Loader, NotificationBell
│   │   │   ├── dashboard/       # DashboardSidebar, RecentChats, UserProfile
│   │   │   ├── pdf/             # PDFViewer with dynamic sizing & pagination
│   │   │   ├── sidebar/         # Sidebar, FileUpload, DocumentCard
│   │   │   └── ui/              # Button, Card, Modal, StatusBadge primitives
│   │   ├── context/             # AuthContext & ThemeContext (Dark/Light)
│   │   ├── layouts/             # DashboardLayout & AuthLayout wrappers
│   │   ├── pages/               # Dashboard, Chats, Documents, Notifications, Profile, Settings, Login, Register, ForgotPassword, VerifyEmail, Notfound
│   │   ├── routes/              # Protected routing & AppRoutes definition
│   │   ├── index.css            # Tailwind CSS styling & custom scrollbars
│   │   └── App.jsx              # Root component with Toast & Router providers
│   ├── package.json             # NPM dependencies & scripts
│   └── vite.config.js           # Vite build configuration
│
├── .gitignore                   # Ignore rules for virtualenvs, node_modules, and cache
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python**: Version `3.10` or higher
- **Node.js**: Version `18.0` or higher (with `npm`)
- **Ollama**: Installed from [ollama.com](https://ollama.com)

---

### 2. Pull Local AI Model
Ensure Ollama is running and pull the default `qwen2.5:7b` model:
```bash
ollama pull qwen2.5:7b
ollama serve
```

---

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
# Windows (PowerShell):
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS:
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI backend server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend API will be running at `http://127.0.0.1:8000`  
Swagger API Docs available at `http://127.0.0.1:8000/docs`

---

### 4. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install NPM packages
npm install

# Start development server
npm run dev
```
Frontend client will be accessible at `http://localhost:5173`

---

## 📡 API Reference Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new account & generate 6-digit verification code | ❌ No |
| `POST` | `/auth/verify-email` | Verify 6-digit code and activate account | ❌ No |
| `POST` | `/auth/resend-verification` | Resend fresh 6-digit verification code | ❌ No |
| `POST` | `/auth/login` | Authenticate user and issue JWT bearer token | ❌ No |
| `POST` | `/auth/forgot-password` | Request password recovery code | ❌ No |
| `POST` | `/auth/reset-password` | Reset password using recovery code | ❌ No |
| `PUT` | `/auth/profile` | Update user profile info (name, email) | ✅ Yes |
| `PUT` | `/auth/change-password` | Change account password with current verification | ✅ Yes |
| `POST` | `/upload` | Upload and chunk PDF (scoped to user folder & vectors) | ✅ Yes (`X-User-ID`) |
| `GET` | `/documents` | List uploaded documents for authenticated user | ✅ Yes (`X-User-ID`) |
| `GET` | `/documents/{filename}` | Preview document page count and text excerpt | ✅ Yes (`X-User-ID`) |
| `DELETE` | `/documents/{filename}` | Delete PDF and its ChromaDB vectors | ✅ Yes (`X-User-ID`) |
| `POST` | `/chat` | Query RAG pipeline against document with multi-turn memory | ✅ Yes |
| `GET` | `/history/user/{user_id}` | Fetch all conversation sessions for user | ✅ Yes |
| `GET` | `/history/session/{session_id}` | Fetch chat message history for specific session | ✅ Yes |
| `PUT` | `/history/session/{session_id}/title` | Rename conversation session | ✅ Yes |
| `DELETE` | `/history/session/{session_id}/messages` | Forget context / clear messages in session | ✅ Yes |
| `DELETE` | `/history/user/{user_id}/clear` | Clear all conversations for user | ✅ Yes |
| `GET` | `/notifications/user/{user_id}` | List user notifications | ✅ Yes |
| `GET` | `/notifications/user/{user_id}/unread-count` | Get unread notification counter | ✅ Yes |
| `PUT` | `/notifications/user/{user_id}/read-all` | Mark all notifications as read | ✅ Yes |

---

## 🚀 Cloud Hosting Guide (100% Free Tier: Vercel + Render)

You can host this entire full-stack application online on free tier services without paying for expensive GPU servers.

```mermaid
graph LR
    User["User Browser"] -->|HTTPS| Vercel["Frontend on Vercel (Free)"]
    Vercel -->|REST API| Render["Backend on Render (Free)"]
    Render -->|Free Fast LLM Inference| Groq["Groq Cloud API (Free Llama 3.3 70B)"]
    Render -->|Scoped Vectors & Embeddings| Chroma["ChromaDB / SQLite"]
```

### Step 1: Get a Free Groq API Key (1 Minute)
Free-tier cloud containers (512MB RAM, no GPU) cannot run a 16GB local Ollama model. **Groq** offers 100% free, ultra-fast inference (500 tokens/sec) for `qwen/qwen3.8-27b` with zero credit card required.
1. Visit [console.groq.com](https://console.groq.com) and sign in with GitHub or Google.
2. Navigate to **API Keys** and click **Create API Key**.
3. Copy your key (starts with `gsk_...`).

---

### Step 2: Deploy Backend to Render.com (Free)
1. Sign up or log into [render.com](https://render.com) with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository: `enterprise-rag-assistant`.
4. Configure the service:
   - **Name**: `enterprise-rag-api`
   - **Root Directory**: `backend`
   - **Language**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `SECRET_KEY`: *(click Generate or enter any random 32-character string)*
   - `GROQ_API_KEY`: `gsk_your_groq_api_key_here`
   - `GROQ_MODEL`: `qwen/qwen3.8-27b`
   - `CORS_ORIGINS`: `*`
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://enterprise-rag-api.onrender.com`).

---

### Step 3: Deploy Frontend to Vercel (Free)
1. Sign up or log into [vercel.com](https://vercel.com) with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your `enterprise-rag-assistant` repository.
4. In the configuration screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://enterprise-rag-api.onrender.com` *(your Render backend URL from Step 2, without trailing slash)*
6. Click **Deploy**.
7. In ~60 seconds, your site is live! Click your generated Vercel domain to use your cloud-hosted Enterprise RAG app.

---

## 🔒 Security & Privacy Best Practices

- **Zero Data Leakage**: Inferences run locally via Ollama (`http://localhost:11434`) during local development, or via encrypted API keys when hosted in cloud.
- **Isolated Storage**: Documents are physically partitioned per user (`uploads/{user_id}/`), preventing cross-user file access.
- **Filtered Vectors**: ChromaDB vector retrieval strictly matches `user_id` metadata.
- **Bcrypt Hashing**: Passwords stored as secure salted Bcrypt hashes.
- **Email Verification Guard**: Unverified users cannot obtain JWT session tokens until they verify their 6-digit code.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).


