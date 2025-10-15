# 🤖 AI Customer Support Bot

An AI-powered customer support assistant built using **Supabase** for session management and database, and **Gemini (Google Generative AI)** for intelligent query handling and conversation understanding.  
This project simulates real-world customer support interactions, complete with **FAQ-based responses**, **contextual memory**, and **escalation scenarios**.

---

## 🚀 Overview

The **AI Customer Support Bot** is designed to:
- Handle **customer queries** using natural language understanding.
- Maintain **conversation context** through Supabase session tracking.
- Simulate **escalation workflows** when queries can’t be resolved by AI.
- Optionally provide a **frontend chat interface** for real-time interactions.

---

## 🧠 Features

✅ AI-powered FAQ-based responses using **Gemini LLM**  
✅ Contextual memory for each user session  
✅ Escalation mechanism for unresolved queries  
✅ RESTful backend with modular APIs  
✅ Supabase integration for session & message tracking  
✅ Optional React-based chat UI  
✅ Ready-to-deploy architecture (Vercel / Render / Hugging Face)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TailwindCSS + TypeScript *(optional)* |
| **Backend** | Node.js + Express |
| **Database** | Supabase (PostgreSQL) |
| **AI Model** | Gemini API (Google Generative AI) |
| **Auth** | Supabase Auth |
| **Deployment** | Vercel / Render / Hugging Face Spaces |

---

## 🗂️ Project Structure

ai-customer-support-bot/
│
├── backend/
│ ├── server.js # Express entry point
│ ├── routes/
│ │ ├── chat.js # /api/chat – Handles queries
│ │ ├── faq.js # /api/faq – FAQ management
│ │ └── escalate.js # /api/escalate – Escalation logging
│ ├── services/
│ │ ├── geminiClient.js # Handles Gemini API calls
│ │ └── supabaseClient.js # Database operations
│ └── utils/
│ └── conversationMemory.js # Context handling
│
├── frontend/ # (optional)
│ ├── src/
│ │ ├── components/ChatUI.tsx
│ │ ├── pages/Home.tsx
│ │ └── utils/api.ts
│ └── package.json
│
├── .env.example
├── README.md
├── package.json
└── LICENSE


---

## 🧩 Database Schema (Supabase)

| Table | Description |
|--------|-------------|
| **sessions** | Tracks each chat session with timestamps |
| **messages** | Stores user & bot messages with roles |
| **faqs** | Stores predefined FAQ dataset |
| **escalations** | Logs escalated queries for manual review |

```sql
-- Example Supabase Schema
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question TEXT,
  answer TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE escalations (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  reason TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

git clone https://github.com/rimjhimjha/ai-customer-bot.git
cd ai-customer-bot
npm install
npm run dev

| Endpoint        | Method | Description                   |
| --------------- | ------ | ----------------------------- |
| `/api/chat`     | `POST` | Send a query, get AI response |
| `/api/faq`      | `GET`  | Retrieve FAQ dataset          |
| `/api/escalate` | `POST` | Log an escalation request     |




Example Request:
POST /api/chat
{
  "session_id": "uuid-of-session",
  "message": "How can I return a product?"
}

Example Response
{
  "reply": "To return a product, please visit the Returns section under My Orders.",
  "escalated": false
}


🧠 Gemini Integration

Uses Gemini API for natural conversation and contextual reasoning.

Pulls last few conversation messages from Supabase for continuity.

Uses FAQ data to guide Gemini responses.

If Gemini’s confidence is low, the query is escalated automatically.

🔄 Escalation Flow

If Gemini responds with uncertainty → bot replies "Let me connect you to support."

The query is logged in escalations table.

Admins can later review and mark it as resolved.
