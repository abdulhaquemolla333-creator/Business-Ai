# Business AI — Standalone App Project

Two pieces, in order:

1. **`backend/`** — a small server that holds your Anthropic API key and talks to Claude.
   Deploy this first. See `backend/README.md`.
2. **`capacitor-app/`** — the app itself (the same design you saw in the browser),
   wrapped so it can be built into a real Android `.apk`. It calls your backend instead
   of the in-chat Claude connection. See `capacitor-app/README.md`.

## Quick path

```
1. cd backend        → npm install → add your API key to .env → npm start (test locally)
2. Deploy backend     → get a public https:// URL (Render / Railway / Fly.io)
3. cd capacitor-app   → edit www/index.html, set BACKEND_URL to that URL
4. npm install → npx cap add android → npx cap sync android → npx cap open android
5. In Android Studio: Build → Build APK(s)
```

You'll end up with an installable `.apk` that runs the Business AI interface (chat
history, voice input, photo upload, subscription screen) and gets real answers from
Claude through your own server.
