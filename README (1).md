# Business AI — Backend

A tiny server that sits between your app and Claude. It keeps your Anthropic API key private
(never put it inside the app itself — anyone could extract it from an APK).

## Run it locally

```bash
cd backend
npm install
cp .env.example .env
# open .env and paste your real ANTHROPIC_API_KEY
npm start
```

It starts on `http://localhost:3000`. Test it:

```bash
curl http://localhost:3000/health
```

## Get an Anthropic API key

1. Go to https://console.anthropic.com
2. Create an account, add billing
3. Create an API key and paste it into `.env`

## Put it online (so your phone/APK can reach it)

Your Android app needs a real HTTPS URL, not `localhost`. Easiest free/cheap options:

- **Render.com** — connect this `backend/` folder as a Web Service, set the `ANTHROPIC_API_KEY`
  environment variable in its dashboard, deploy. You'll get a URL like
  `https://your-app.onrender.com`.
- **Railway.app** — similar flow, also has a generous free tier.
- **Fly.io** — good if you want more control.

Whichever you use, once deployed:

1. Copy the public HTTPS URL it gives you
2. Open `capacitor-app/www/index.html`
3. Find the line near the top of the `<script>`:
   ```js
   const BACKEND_URL = "https://your-backend-url.example.com";
   ```
4. Replace it with your real URL (no trailing slash)

## API

`POST /api/chat`

```json
{
  "turns": [{ "role": "user", "content": "How should I price a new product?" }],
  "image": null
}
```

Response:
```json
{ "text": "..." }
```

`image` is optional — a full data URL (`data:image/jpeg;base64,...`) for the latest message only.
