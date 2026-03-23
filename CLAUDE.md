# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Monorepo for a Firebase-backed activity tracking app with multiple frontends:

- `react/` — React SPA (Vite, Chakra UI, PWA) — see `react/CLAUDE.md`
- `functions/` — Firebase Cloud Functions (Node 20) — see `functions/CLAUDE.md`
- ALL other folders are OUT OF SCOPE nd so don't examine/read them for any task you have.

## Commands (Root)

```bash
# Full deploy: build Vue + React, deploy to Firebase
npm run deploy

# Deploy Firestore rules only
npm run deploy:db

# Deploy functions only
npm run deploy:functions

# Deploy functions with environment vars (uses firebase-env.js)
npm run deploy:functions-env

# Deploy hosting target (only the `react` app)
npm run deploy:hosting:react
```

## Firebase

### Configuration

- **Project**: `calendar-activities`
- **Multi-hosting**: React (`calendar-activities`), other targets are irrelevant
- **Firestore rules**: Activities/users collections, read for all, write requires auth
- **Functions env vars**: Set via `firebase-env.js` which reads `.env`, `.env.local`, `.env.production.local` and calls `firebase functions:config:set`

### Environment Variables

Root `.env` files are read by `firebase-env.js` to configure Firebase functions:

- `VUE_APP_*` → `functions.*` config (lowercased, dot-separated)
- Skips `firebase` and `cli` namespaces
- Example: `VUE_APP_FIREBASE_COLL_ACTIVITIES=activities` → `db.collactivities=activities`

## Firebase Functions

Inside the `functions` subfolder. See its respective `CLAUDE.md` file.

## The React SPA

Inside the `react` subfolder. See its respective `CLAUDE.md` file.
