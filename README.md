# Preproute — Test Management

A React + TypeScript application for the Preproute Frontend Developer assignment. It implements the 5-page flow: **Login → Dashboard → Create/Edit Test → Add Questions → Preview & Publish**, integrated with the staging API at `https://admin-moderator-backend-staging.up.railway.app/api`.

## Tech stack
- **React 19 + TypeScript** on TanStack Start (file-based routing under `src/routes/`)
- **Axios** for HTTP (single instance + JWT interceptor + 401 handling)
- **React Hook Form + Zod** for forms and validation
- **Tailwind v4 + shadcn/ui** for styling and primitives
- **sonner** for toasts
- React Context for auth, simple `useState/useEffect` hooks for server state (no TanStack Query)

## Project structure
```
src/
  config/env.ts                 # VITE_API_BASE_URL with sane fallback
  lib/
    api/client.ts               # axios instance + interceptors + unwrap helper
    api/endpoints.ts            # centralized endpoint URLs
    api/types.ts                # ApiResponse<T>, ApiError
    storage.ts                  # safe localStorage helpers
  types/                        # shared domain types (Test, Question, …)
  features/                     # services + hooks per feature
    auth/        AuthProvider, useAuth, auth.service, auth.schema
    tests/       tests.service, useTests, useTest, tests.schema
    questions/   questions.service, questions.schema
    taxonomy/    taxonomy.service, useSubjects, useTopics, useSubTopics
  components/
    ui/         shadcn primitives
    form/       TextField, NumberField, TextAreaField, SelectField,
                MultiSelectField, RadioGroupField, FormSection
    layout/     AppShell, Sidebar, Topbar, PageHeader, StepIndicator
    feedback/   LoadingSpinner, EmptyState, ConfirmDialog, StatusBadge
    auth/       LoginForm
    test/       TestForm, TestTable, TestPreviewSummary,
                QuestionForm, QuestionListItem, QuestionPreviewCard
  routes/                       # file-based pages (thin)
```

## Running locally
```bash
bun install
bun run dev
```

Optional env: create `.env.local` with `VITE_API_BASE_URL=…` to point at a different backend.

## Test credentials
- User ID: `vedant-admin`
- Password: `vedant123`

## Architectural notes / decisions
- **Axios only** as requested: one shared `api` instance attaches the JWT, normalizes `{ success, data }` envelopes, and redirects to `/login` on 401.
- **Modular features**: each feature owns its service (HTTP), schema (zod), and hooks. Pages stay thin and compose feature hooks + UI components.
- **Composed form components** in `components/form/*` wrap shadcn primitives + RHF so pages never use raw `<input>`. All fields support label, required marker, error state, and consistent layout.
- **Layout primitives** (`AppShell`, `PageHeader`, `StepIndicator`) keep page chrome consistent across the multi-step flow.
- **Cascading dropdowns** in the test form: subject → topics → sub-topics. Topics are fetched only after a subject is chosen; sub-topics use the `POST /sub-topics/multi-topics` endpoint when multiple topics are selected.
- **Question flow**: questions are collected client-side, submitted in a single `POST /questions/bulk`, then the returned IDs are written back to the test via `PUT /tests/:id` along with updated `total_questions` and `total_marks`.
- **Publish**: `PUT /tests/:id` with `{ status: "live" }`.
- **Validation**: all forms validated client-side with zod; the API still re-validates server-side.
- **Auth state**: token + user persisted to `localStorage` via a small `storage` wrapper; `AuthProvider` exposes `login`/`logout`. Route guard lives in `_authed.tsx`.

## Notes / known limitations
- The spec does not include a `DELETE /tests/:id` endpoint, so delete is not exposed in the UI by default.
- The `Test Type` dropdown defaults to `chapterwise / full-syllabus / custom` — adjust in `src/components/test/TestForm.tsx` if the backend expects different values.
