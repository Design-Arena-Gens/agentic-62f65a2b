# Driver Helper — Offline-First AI Copilot

Driver Helper is a PWA-ready Next.js application that mirrors the "Driver Helper" Android flow with deployable web tech. It delivers an offline-first cockpit for Indian commercial drivers, backed by an in-browser SQLite database (`sql.js` + IndexedDB persistence) and Gemini-powered copilots for voice logging, bilingual chat, translation, and smart search.

## ✨ Core Capabilities

- **Offline-first data layer** – Trips, expenses, reminders, and voice notes live in SQLite and persist in IndexedDB for true offline durability.
- **Auto cloud sync** – When connectivity returns, the app pushes the full dataset to `/api/sync` (stubbed for demos, replaceable with any REST backend: Firebase, Amplify, Supabase, etc.).
- **Gemini AI workflows** – Unified voice-to-text, Hindi ↔ English translation, contextual chat, and smart insights powered by Gemini.
- **Voice diary** – Web Speech API integration lets drivers dictate notes that are saved locally and synced later.
- **Modular journey map** – Splash/login, dashboard, trip planner, expense tracker, AI hub, and maintenance checklist arranged exactly like a visual flowchart for low-connectivity regions.
- **Installable PWA** – Uses `next-pwa`, manifest, and service worker so it can be installed on Android or wrapped as a TWA for Play Store distribution.

## 🚀 Getting Started

```bash
npm install
npm run dev
# visit http://localhost:3000
```

### Environment

Set your Gemini key so the AI routes can talk to Google's Generative AI services:

```bash
export GEMINI_API_KEY="your-google-generative-ai-key"
```

The `/api/sync` route currently stores the most recent payload in memory (enough for Vercel demos). Swap the handler with your preferred cloud backend to enable multi-device sync.

## 🧱 Project Structure

```
app/                # Next.js app router pages & API handlers
public/             # Static assets (PWA manifest, wasm, icons)
src/components/     # Flow-specific UI components
src/hooks/          # Online + autosync hooks
src/lib/            # SQLite helpers & repository layer
src/providers/      # React Query provider wrapper
src/state/          # Zustand store wired to SQLite
src/types/          # Web Speech typings
```

## 🔌 Scripts

- `npm run dev` – local development server
- `npm run build` – production build output
- `npm start` – serve the production build
- `npm run lint` – lint with Next defaults
- `npm test` – Vitest hook (ready for future specs)

## 🧠 Customisation Ideas

1. Replace `/api/sync` with Firestore, Realtime Database, or Supabase edge functions for full cloud sync.
2. Connect Gemini streaming/multimodal endpoints for richer copilots.
3. Extend the SQLite schema with driver performance metrics or compliance logs.
4. Package the PWA as a Trusted Web Activity to ship through the Play Store.

## 📄 License

MIT — free to adapt with attribution.

---

Built autonomously by Codex to realise the Driver Helper blueprint with reliable web technologies.
