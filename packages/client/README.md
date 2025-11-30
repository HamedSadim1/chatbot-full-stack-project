# WonderChat client

React + Vite front-end for the WonderWorld chatbot.

## Quick start

```bash
cd packages/client
bun install
bun run dev
```

During local development the Vite dev server proxies `/api/*` calls to the Bun/Express backend on port `3000` (configured in `vite.config.ts`).

## Environment

Configure the API origin with `VITE_API_BASE_URL`. This value defaults to `/api`, which works when the front-end is served by the same domain and the backend exposes `/api` routes. For a different origin (e.g. `http://localhost:3000/api` or a deployed server), create a `.env` file based on `.env.example`:

```dotenv
VITE_API_BASE_URL="http://localhost:3000/api"
```

Restart the Vite dev server after changing env variables.
