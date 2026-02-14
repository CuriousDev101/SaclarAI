# ScalarAI

A RAG-powered chatbot and document assistant built with Vue 3, Vite, and TypeScript.

It provides:

* Streaming chat-based document Q&A (SSE)
* Document upload & admin interface
* Simple JWT authentication (Pinia + local storage)

---

## Quick Start

**Requirements**

* Node.js ≥ 20.19.0 or ≥ 22.12.0
* pnpm (recommended)

Install dependencies:

```bash
pnpm install
```

Start dev server:

```bash
pnpm dev
# http://localhost:5173
```

Build:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

Type check:

```bash
pnpm run type-check
```

---

## Backend API

ScalarAI requires a separate backend API built with **Deno + Express**:

👉 [https://github.com/CuriousDev101/ScalarAI-API](https://github.com/CuriousDev101/ScalarAI-API)

The backend handles:

* Authentication (JWT)
* Document upload & management
* Vector search (pgvector)
* Streaming chat responses (SSE)

### Running with Local Backend

1. Clone and start the backend (`ScalarAI-API`)
```bash
git clone https://github.com/CuriousDev101/ScalarAI-API.git

```
2. By default it runs on:

```
http://localhost:3000
```

3. In the frontend project, create a `.env` file:

```
VITE_API_URL=http://localhost:3000
```

4. Start the frontend:

```bash
pnpm dev
```

The frontend will now communicate with the backend at:

```
${import.meta.env.VITE_API_URL}
```

---

## Features

* Vue 3 + Vite + TypeScript
* Pinia auth store
* Axios interceptor with Bearer token
* Streaming chat (SSE-style parsing)
* Admin document management
* Tailwind + DaisyUI UI

---

## Routes

* `/` — Home
* `/login` — Login
* `/signup` — Signup
* `/chat` — Chat (auth required)
* `/admin` — Admin (auth required)

Routes with `meta.requiresAuth` redirect to `/login` if not authenticated.

---

## Authentication

Managed via Pinia (`useAuthStore.ts`).

* `signup(name, email, password)`
* `login(email, password)`
* `logout()`

On success:

* Token + user stored in localStorage
* Axios automatically attaches `Authorization: Bearer <token>`

---

## Chat (Streaming SSE)

The chat:

* Sends `POST /api/chat/stream`
* Body: `{ message: string }`
* Parses streamed `event:` and `data:` blocks
* Appends `content` events progressively
* Displays optional `sources`

Backend must:

* Support streaming responses
* Allow CORS for frontend origin
* Send chunked/SSE-style responses

---

## Expected API Endpoints

**Auth**

* `POST /api/auth/signup`
* `POST /api/auth/login`

**Admin**

* `GET /api/admin/documents`
* `POST /api/admin/upload` (multipart/form-data)

**Chat**

* `POST /api/chat/stream` (streaming response)

Authenticated routes require Bearer token.

---

## Project Structure

```
src/
  main.ts
  router/
  stores/
  views/
  components/
  utils/
```

Key files:

* `useAuthStore.ts` — auth logic
* `axios.ts` — API client + interceptor
* `ChatWidget.vue` — streaming chat
* `router/index.ts` — routes & guards

---

## Troubleshooting

* Ensure Node version matches `engines`
* Replace hardcoded API URLs with `VITE_API_URL`
* Confirm backend CORS supports streaming
* If token not sent, verify Pinia store + localStorage
* Use `pnpm run type-check` for TS errors
