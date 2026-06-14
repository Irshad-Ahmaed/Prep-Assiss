# Preproute — Test Management

A React + TypeScript application for the Preproute Frontend Developer assignment. It implements the 5-page flow: **Login → Dashboard → Create/Edit Test → Add Questions → Preview & Publish**, integrated with the provided Staging API at railway.

## Tech stack
- **React 19 + TypeScript** on TanStack Start (file-based routing under `src/routes/`)
- **Axios** for HTTP (single instance + JWT interceptor + 401 handling)
- **React Hook Form + Zod** for forms and validation
- **Tailwind v4 + shadcn/ui** for styling and primitives
- **sonner** for toasts
- React Context for auth, simple `useState/useEffect` hooks for server state (no TanStack Query)

## Running locally
```bash
bun install
bun run dev
```

Optional env: create `.env.local` with `VITE_API_BASE_URL=…` to point at a backend.

## Test credentials
- User ID: `vedant-admin`
- Password: `vedant123`