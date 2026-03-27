# MindCheck

MindCheck is a web app for **student mental wellbeing**. It offers private self-check assessments, a personal journal, goals, dashboard insights, and curated resources—backed by **Supabase** for authentication and data.

This README explains **how to set up the project from scratch**. Follow **every step below in order** to get the app running on your machine.

---

## Run the project locally (complete setup)

Do these steps **one after another**. Skip none of them unless noted.

### Step 1 — Install Node.js

1. Install **[Node.js](https://nodejs.org/)** (LTS is fine). This gives you `node` and `npm`.
2. Confirm it worked:

   ```bash
   node -v
   npm -v
   ```

   You should see version numbers (Node **18 or newer** is required; **20+** is recommended).

### Step 2 — Get the code

1. **Clone** this repository (use your fork or the repo URL from GitHub):

   ```bash
   git clone <paste-the-repository-url-here>
   ```

2. **Go into the project folder**:

   ```bash
   cd MindCheck
   ```

   (If your folder has a different name, `cd` into that folder instead.)

### Step 3 — Install dependencies

From the project root (the same folder that contains `package.json`), run:

```bash
npm install
```

Wait until it finishes with no errors. This downloads everything listed in `package-lock.json` into `node_modules/`.

### Step 4 — Create a Supabase project (required for login and data)

The app expects Supabase credentials. Without them, the app may not connect correctly.

1. Open **[supabase.com](https://supabase.com)** and sign in (or create an account).
2. Click **New project**, pick an organization, set a **name**, **database password**, and **region**, then create the project.
3. Wait until the project finishes provisioning.
4. In the Supabase dashboard, open **Project Settings** (gear icon) → **API**.
5. Keep this page open—you need two values in the next step:
   - **Project URL** (sometimes labeled “URL”)
   - **`anon` `public`** key (the public client key—safe to use in the browser)

### Step 5 — Configure environment variables

1. In the project root, **copy the example env file** to a real `.env` file:

   **macOS / Linux:**

   ```bash
   cp .env.example .env
   ```

   **Windows (Command Prompt):**

   ```bat
   copy .env.example .env
   ```

   **Windows (PowerShell):**

   ```powershell
   Copy-Item .env.example .env
   ```

2. Open **`.env`** in a text editor.

3. Set **exactly** these variables (no quotes needed unless your editor adds them):

   | Variable | What to paste |
   |----------|----------------|
   | `VITE_SUPABASE_URL` | The **Project URL** from Supabase **Settings → API** |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | The **`anon` `public`** key from the same page |

4. Save the file.  
   **Do not commit `.env`**—it is already listed in `.gitignore`.

### Step 6 — Start the development server

From the project root, run:

```bash
npm run dev
```

You should see terminal output that includes a **local URL** (by default the app uses port **8080**).

### Step 7 — Open the app in your browser

1. Open a browser and go to: **[http://localhost:8080](http://localhost:8080)**  
   If your terminal printed a different URL (for example another port), use **that** URL instead.

2. You should see the MindCheck UI. Sign-up and features that use the database require your Supabase project to be set up and the env vars to be correct.

### Step 8 — Stop the server (when you are done)

In the terminal where `npm run dev` is running, press **Ctrl+C** to stop the dev server.

---

## If something goes wrong

| Problem | What to try |
|--------|-------------|
| `command not found: npm` | Install Node.js (Step 1) and restart the terminal. |
| `npm install` errors | Use a supported Node version; delete `node_modules` and run `npm install` again. |
| Blank page or Supabase errors | Check `.env` values, no extra spaces; confirm the Supabase project is active. |
| Port 8080 already in use | Stop the other process using that port, or change the port in `vite.config.ts` under `server.port`. |
| Playwright / `test:e2e` says port in use | Stop `npm run dev` before e2e tests, or rely on Playwright’s `reuseExistingServer` when only one server should run. |

---

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (dev server on port `8080` by default)
- **React Router** for routing
- **TanStack Query** for server/async state
- **Supabase** (`@supabase/supabase-js`) for auth and database
- **Tailwind CSS** + **shadcn/ui**-style components (Radix primitives)
- **Vitest** + Testing Library for unit tests
- **Playwright** for end-to-end tests (see `e2e/`)

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest (single run) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | Playwright (starts dev server when needed) |

## Project layout

- `src/pages/` — Route-level screens (home, dashboard, journal, self-check, etc.)
- `src/components/` — Shared UI, including `ui/` primitives
- `src/contexts/` — React context (e.g. auth)
- `src/integrations/supabase/` — Supabase client and generated types
- `e2e/` — Playwright specs (add `*.spec.ts` files here)
- `public/` — Static assets served as-is

## Security notes

- Never commit `.env` or real secrets. They are listed in `.gitignore`.
- The Supabase **anon** key is intended for the client; configure **Row Level Security (RLS)** in Supabase for your tables.

## License

Private / unlicensed unless you add a license file.
