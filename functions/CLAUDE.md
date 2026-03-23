# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
cd functions

# Run Firebase emulators locally
npm run serve

# Deploy to Firebase
npm run deploy

# View function logs
npm run logs

# Lint
npm run lint
```

## Architecture

### Firebase Functions (Node 20)

- Runtime: Node 20 (see `engines.node` in package.json)
- SDK: firebase-admin v10, firebase-functions v3.16
- Main entry: `index.js`

### Exports

- `activityIncrease` - increment activity current counter
- `activityReset` - reset activity current to 0

### Auth

- All functions require Firebase Auth token (checked via `checkAuthorized()`)
- Throws `functions.https.HttpsError` if unauthenticated

### Firestore

- Collections: `users`, `activities`
- Collection names from `functionsConfig.db.collusers` and `functionsConfig.db.collactivities` (set via CLI: `firebase functions:config:set db.collusers="xxx"`)
- `ignoreUndefinedProperties: true` set on Firestore instance

### Environment Variables

Use Firebase CLI to set config:

```bash
firebase functions:config:set db.collusers="users" db.collactivities="activities"
```

Config utility: `firebase-env.js` (in project root)
