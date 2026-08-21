# 🚀 Deployment Guide: Frontend on Netlify & Backend on Render

This guide provides the **exact, step-by-step instructions** to deploy your **Skilldotpy** application with:
1. **Frontend (React + Vite SPA)** on **Netlify** (Free Tier)
2. **Backend API (Node.js + Express + Gemini AI)** on **Render** (Free Web Service)

---

## 📁 Step 1: Exporting & Preparing Your Project Files

### How to Export from AI Studio
1. Click the **Project Settings / Export** menu in the top right of AI Studio.
2. Select **Export ZIP** (or **Push to GitHub** if connected).
3. If you downloaded a ZIP file, extract it to a folder on your computer (e.g., `skilldotpy-app`).

---

## 📂 Step 2: Which Files to Upload vs. Which Files NOT to Upload

### ✅ CRITICAL: Files to Upload to GitHub / Git Repository:
* `src/` (Entire folder with all React components, pages, data, services, styles)
* `public/` (Images, PDF syllabus assets, icons)
* `index.html` (Entry HTML)
* `package.json` (Project dependencies and scripts)
* `tsconfig.json` (TypeScript configuration)
* `vite.config.ts` (Vite bundler configuration)
* `netlify.toml` (Netlify SPA routing configuration)
* `server.ts` (Express server with Gemini AI API endpoints)
* `firebase-applet-config.json` (Public Firebase client configuration for Firestore)
* `firestore.rules` (Security rules)
* `.env.example` (Reference documentation for environment variables)

---

### ❌ NEVER Upload / Keep in `.gitignore`:
* ❌ `node_modules/` (Never upload. Render & Netlify install fresh automatically)
* ❌ `dist/` or `build/` (Never upload. Built by CI/CD automatically)
* ❌ `.env` or `.env.local` containing actual secret keys (Set secrets in Render/Netlify dashboards instead!)
* ❌ `.DS_Store`, `npm-debug.log*`, `yarn-error.log*`

---

## ☁️ Step 3: Deploy Backend on Render (FIRST)

> **Why Deploy Backend First?**  
> Because Render will generate a unique live URL (e.g., `https://skilldotpy-backend.onrender.com`), which you need to provide to your Netlify frontend!

### Step-by-Step Render Setup:
1. **Sign in to Render**: Go to [https://render.com](https://render.com) and sign in (using your GitHub/GitLab account).
2. Click **"New +"** button at the top and select **"Web Service"**.
3. Select **"Build and deploy from a Git repository"** and choose your repository.
4. Fill in the service configuration:
   - **Name**: `skilldotpy-api` (or any custom name)
   - **Region**: Choose closest to your users (e.g., *Singapore* or *Frankfurt*)
   - **Branch**: `main` (or `master`)
   - **Runtime**: **Node**
   - **Build Command**:
     ```bash
     npm install && npm run build:server
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: **Free**
5. **Add Environment Variables**:
   - Scroll down to the **"Environment Variables"** section and click **"Add Environment Variable"**:
     - Key: `GEMINI_API_KEY`
     - Value: `Your Google Gemini API Key` (e.g., from [Google AI Studio](https://aistudio.google.com/app/apikey))
     - Key: `NODE_ENV`
     - Value: `production`
     - Key: `PORT`
     - Value: `3000` (Render will automatically detect this)
6. Click **"Create Web Service"**.
7. Wait 2–3 minutes for the build to complete. Once deployed, Render will provide your backend URL:
   👉 Example: `https://skilldotpy-api.onrender.com`
8. **Test Backend**: Open `https://skilldotpy-api.onrender.com/api/health` in your browser. It should return:
   ```json
   {"status":"ok","timestamp":1740000000000}
   ```

---

## ⚡ Step 4: Deploy Frontend on Netlify

### Step-by-Step Netlify Setup:
1. **Sign in to Netlify**: Go to [https://www.netlify.com](https://www.netlify.com) and log in.
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select **GitHub** (or your Git provider) and select your repository.
4. Configure Build settings:
   - **Base directory**: Leave blank (root `.`)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. **Add Environment Variables in Netlify**:
   - Click **"Add environment variables"** or go to **Site configuration > Environment variables**:
     - Key: `VITE_API_BASE_URL`
     - Value: `https://skilldotpy-api.onrender.com` *(Paste your Render backend URL from Step 3 without trailing slash!)*
     - *(Optional)* Key: `VITE_ADSENSE_CLIENT_ID`
     - *(Optional)* Value: `ca-pub-XXXXXXXXXXXXXXXX` (if you have Google AdSense)
6. Click **"Deploy site"**.
7. Netlify will build the site in ~1 minute. Once done, your frontend will be live at:
   👉 Example: `https://skilldotpy.netlify.app`

---

## 🔒 Step 5: Firebase Authentication & Firestore Setup

Your frontend connects directly to Firebase Firestore for notes, resources, and submissions.

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your Firebase project (`diesel-aloe-f8gvj`).
3. Navigate to **Authentication > Settings > Authorized domains**.
4. Click **"Add domain"** and add:
   - Your Netlify domain (e.g., `skilldotpy.netlify.app` or your custom domain `skilldotpy.com`).
5. Ensure your `firestore.rules` are deployed (the project already contains secure read/write rules).

---

## 🔄 Step 6: Verification Checklist

1. Open your Netlify URL in a browser.
2. Visit **Practical Exam Workspace** -> Open **AI Code Helper** / Click **Submit Exam**. Verify it connects to Render and returns AI evaluations.
3. Open the **24/7 AI Doubt Solver** from the floating button and ask a doubt. Verify real-time streaming answers work.
4. Try refreshing on inner pages like `/o-level/m1-r5` or `/mock-test` to confirm the `netlify.toml` SPA redirect works with zero 404 errors.
