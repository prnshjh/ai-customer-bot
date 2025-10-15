# 🤖 AI Customer Support Bot

An AI-powered customer support assistant leveraging **Supabase** for session management and storage, and **Gemini (Google Generative AI)** for intelligent query handling and conversation understanding[...]
Simulates realistic customer support with **FAQ-based responses**, **contextual memory**, and **escalation scenarios**.

---

## 🚀 Overview

- **Handles customer queries** using natural language understanding (Gemini LLM).
- **Maintains conversation context** with Supabase session tracking.
- **Simulates escalation workflows** for unresolved queries.
- **Optional frontend chat interface** for real-time interactions.

---

## 🧠 Features

- ✅ AI-powered FAQ-based responses via Gemini
- ✅ Contextual memory for each user session
- ✅ Automatic escalation for unresolved queries
- ✅ RESTful modular backend APIs
- ✅ Supabase integration for session & message tracking
- ✅ Optional React-based chat UI
- ✅ Ready-to-deploy (Vercel / Render / Hugging Face)

---

## 🏗️ Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| **Frontend**   | React, TailwindCSS, TypeScript *(optional)* |
| **Backend**    | Node.js, Express                       |
| **Database**   | Supabase (PostgreSQL)                  |
| **AI Model**   | Gemini API (Google Generative AI)      |
| **Auth**       | Supabase Auth                          |
| **Deployment** | Vercel, Render, Hugging Face Spaces    |

---

## 🗂️ Project Structure

```
ai-customer-support-bot/
│
├── backend/
│   ├── server.js                # Express entry point
│   ├── routes/
│   │   ├── chat.js              # /api/chat – Handles queries
│   │   ├── faq.js               # /api/faq – FAQ management
│   │   └── escalate.js          # /api/escalate – Escalation logging
│   ├── services/
│   │   ├── geminiClient.js      # Handles Gemini API calls
│   │   └── supabaseClient.js    # Database operations
│   └── utils/
│       └── conversationMemory.js # Context handling
│
├── frontend/                    # (optional)
│   ├── src/
│   │   ├── components/ChatUI.tsx
│   │   ├── pages/Home.tsx
│   │   └── utils/api.ts
│   └── package.json
│
├── .env.example
├── README.md
├── package.json
└── LICENSE
```

---

## 🧩 Database Schema (Supabase)

| Table        | Purpose                                     |
| ------------ | ------------------------------------------- |
| **sessions**     | Tracks each chat session with timestamps      |
| **messages**     | Stores user & bot messages with roles         |
| **faqs**         | Stores predefined FAQ dataset                 |
| **escalations**  | Logs escalated queries for manual review      |

<details>
<summary>Example Supabase Schema (SQL)</summary>

```sql
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
```
</details>

---

## ⚡ Getting Started

```bash
git clone https://github.com/rimjhimjha/ai-customer-bot.git
cd ai-customer-bot
npm install
npm run dev
```

---

## 🛠️ API Endpoints

| Endpoint         | Method | Description                        |
| ---------------- | ------ | ---------------------------------- |
| `/api/chat`      | POST   | Send a query, get AI response      |
| `/api/faq`       | GET    | Retrieve FAQ dataset               |
| `/api/escalate`  | POST   | Log an escalation request          |

#### Example Request/Response

**POST** `/api/chat`
```json
{
  "session_id": "uuid-of-session",
  "message": "How can I return a product?"
}
```

**Response**
```json
{
  "reply": "To return a product, please visit the Returns section under My Orders.",
  "escalated": false
}
```

---

## 🤖 Gemini Integration

- Uses Gemini API for natural conversation and contextual reasoning.
- Pulls recent conversation messages from Supabase for continuity.
- Leverages FAQ data to guide Gemini responses.
- If Gemini’s confidence is low, the query is escalated automatically.

---

## 🔄 Escalation Flow

- If Gemini responds with uncertainty, bot replies:  
  *"Let me connect you to support."*
- The query is logged in the `escalations` table.
- Admins can later review and mark escalations as resolved.

---

## 💬 Example Prompts & Responses

Basic examples of user prompts and AI bot responses:

| User Prompt                          | Bot Response                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| How can I reset my password?          | To reset your password, go to Account Settings and click 'Reset'.            |
| Do you ship internationally?          | Yes, we offer international shipping to most countries.                      |
| Where is my order?                    | Please provide your order ID, and I'll check the status for you.             |
| I want to return a product.           | To return a product, please visit the Returns section under My Orders.        |
| I have an issue not listed here.      | Let me connect you to support.                                               |

---
