# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
cd react

# Dev server
npm run dev

# Build
npm run build

# Deploy to Surge.sh
npm run surge

# Generate PWA assets (requires public/logo.svg)
npm run generate-pwa-assets
```

## Architecture

### Data Layer (React Query + Firestore)
- All state managed through TanStack Query (React Query)
- Cache hooks in `/cache/`: `auth.ts`, `activities.ts`
- `queryClient` configured in `cache/index.tsx` with toast notifications
- Firestore collections synced via `onSnapshot` → `queryClient.setQueryData()`
- Mutations call Firebase Cloud Functions (`activityIncrease`, `activityReset`) because Firestore rules block direct writes

### Firebase Wrapper
- `lib/firebase.ts` exports singleton instance wrapping Auth, Firestore, Functions, Messaging
- Config from `VITE_FIREBASE_*` env vars
- `parseDocs()` utility converts QuerySnapshots to `{id, ...data}[]`

### Auth Flow
- `useAuth()` returns `{ isKnown, isAuth }` - tracks auth state via `onAuthStateChanged`
- Login mutations: `useAuthLogin()`, `useAuthLoginWithGoogle()`, `useAuthLogout()`
- Auth state persists across sessions via Firebase Auth

### PWA
- Service worker auto-injected via `vite-plugin-pwa`
- Update prompt handled in `registerSW.tsx` (registerType: "prompt")
- Push notifications configured in `configurePushNotifications.ts`

### Routing
- React Router v6 with `/users` and `/activities` routes
- Default route redirects to `/activities`

### Components
- `Nav` - top bar with dark mode toggle and auth buttons
- `Activities` - list with increment/reset buttons (auth-gated)
- `DialogLogin` - email/password login modal
- `TooltipMobile` - conditionally shows tooltips (hidden on mobile via `useMobile` hook)
- `Expander` - spacer flex item

### Environment
Required `.env` vars: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_COLL_ACTIVITIES`
