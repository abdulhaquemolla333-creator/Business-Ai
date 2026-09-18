# Business AI — Android App (Capacitor)

This turns the `www/index.html` app into a real installable `.apk`. It talks to your
own backend server (see `../backend/`) instead of Claude's in-chat connection, so it
works as a standalone app outside claude.ai.

## Requirements on your computer

- Node.js 18+ (https://nodejs.org)
- Android Studio (https://developer.android.com/studio) — this installs the Android SDK too
- The backend already deployed and reachable over HTTPS (see `../backend/README.md`)

## Before you build

1. Deploy the backend first and get its public URL.
2. Open `www/index.html`, find:
   ```js
   const BACKEND_URL = "https://your-backend-url.example.com";
   ```
   and replace it with your backend's real URL.

## Build steps

```bash
cd capacitor-app
npm install
npx cap init "Business AI" "com.businessai.app" --web-dir www
npx cap add android
npx cap sync android
npx cap open android
```

The last command opens the project in **Android Studio**. From there:

1. Wait for Gradle to finish syncing (first time takes a few minutes)
2. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Android Studio will show a notification with a "locate" link — click it to find your
   `.apk` file (usually under `android/app/build/outputs/apk/debug/app-debug.apk`)
4. Copy that `.apk` to your phone and install it (you may need to allow "install from
   unknown sources" once)

## Publishing to the Play Store later

For the Play Store you need a **signed release build** (not the debug APK above):

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Create a keystore (keep it safe — you'll need the same one for every future update)
3. Choose **Android App Bundle (.aab)** — this is what the Play Store wants
4. Create a developer account at https://play.google.com/console (one-time $25 fee)
5. Upload the `.aab`, fill in your store listing, and submit for review

## Notes

- Voice input uses the Web Speech API — it works inside the Android WebView on most
  modern devices, but test it on your target phones.
- Photo upload uses a standard file picker — Android will show camera + gallery options.
- If the app can't reach your backend, check that `BACKEND_URL` uses `https://` (not
  `http://`) and has no typo, and that your phone has internet access.
