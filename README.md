# MindCheck

MindCheck is a web app for **student mental wellbeing**. It offers private self-check assessments, a personal journal, goals, dashboard insights, and curated resources—backed by **Supabase** for authentication and data.

This README explains **how to set up the project from scratch**. Follow **every step below in order** to get the app running on your machine.

### Supabase credentials and `.env`

- The app **requires Supabase credentials** (`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`) to run. Without them, the app will show a blank page or error in the browser console.
- Those values are stored in a file named **`.env`** in the **project root** (same folder as `package.json`).
- **`.env` is not committed to Git** and is **not published** on GitHub—it is listed in `.gitignore` so secrets stay off the public repo.
- **For grading and submission**, the actual credential values are shared separately in the **Google Doc** that accompanies this project. Open that doc, find the Supabase URL and anon (publishable) key, and put them into your local `.env` as described in **Step 4** below.
- The repo includes **`.env.example`** only as a **template** (variable names, no real secrets). Copy it to `.env` and fill in the values from the Google Doc—or from your own Supabase project if you are not using the class credentials.

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

### Step 4 — Create your `.env` file and add Supabase credentials

You need a file named **`.env`** in the project root. It is **created by you locally** and is never part of the GitHub repository.

1. **Create `.env` from the template** (run this in the project root—the folder that contains `package.json`):

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

   That creates a new file **`.env`** next to `.env.example`.

2. **Open `.env`** in any text editor (VS Code, Notepad, etc.).

3. **Fill in the two variables** using the values from the **Google Doc for this submission** (shared with your instructor and class):

   | Variable | Where the value comes from |
   |----------|----------------------------|
   | `VITE_SUPABASE_URL` | Paste the **Supabase Project URL** from the Google Doc |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Paste the **anon / publishable public key** from the Google Doc |

   Remove any placeholder text so each line looks like `VITE_SUPABASE_URL=https://....supabase.co` with no extra spaces around `=`.

4. **Save** the file.

5. **Do not commit `.env`** to Git—it should stay only on your computer. It is already ignored by `.gitignore`.

**Optional — use your own Supabase project instead:** If you are not using the class Google Doc, create a project at **[supabase.com](https://supabase.com)**, then in **Project Settings → API** copy the **Project URL** and the **`anon` `public`** key into the same two variables in `.env`.

### Step 5 — Start the development server

From the project root, run:

```bash
npm run dev
```

You should see terminal output that includes a **local URL** (by default the app uses port **8080**).

### Step 6 — Open the app in your browser

1. Open a browser and go to: **[http://localhost:8080](http://localhost:8080)**  
   If your terminal printed a different URL (for example another port), use **that** URL instead.

2. You should see the MindCheck UI. Sign-up and features that use the database require the Supabase credentials in `.env` to match a working project (the one from the Google Doc, or your own).

### Step 7 — Stop the server (when you are done)

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
