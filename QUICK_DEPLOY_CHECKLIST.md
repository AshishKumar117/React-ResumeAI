# Quick Deployment Checklist

This checklist will help you deploy the ResumeAI app to Vercel and ensure MongoDB Atlas connectivity.

## Pre-Deployment: Local Setup

- [ ] Clone the repo: `git clone https://github.com/AshishKumar117/React-ResumeAI.git`
- [ ] Navigate to the project: `cd React-ResumeAI`
- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env.local` and fill in real credentials:
  ```
  cp .env.example .env.local
  ```
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → from Clerk Dashboard
  - `CLERK_SECRET_KEY` → from Clerk Dashboard
  - `MONGODB_URL` → from MongoDB Atlas (URL-encode special chars in password, e.g., @ → %40)
  - `GEMINI_API_KEY` → from Google AI Studio
  - `BASE_URL` → localhost:3000 (for local dev)

- [ ] Test local MongoDB connectivity:
  ```
  node scripts/check-db.js
  ```
  Expected output: `Connected to MongoDB successfully`

- [ ] Start the dev server:
  ```
  npm run dev
  ```
  Visit http://localhost:3000 and test creating a resume.

## MongoDB Atlas Configuration

**Critical:** Vercel serverless functions use dynamic outbound IPs. Atlas must allow them to connect.

- [ ] In MongoDB Atlas, go to **Network Access → IP Whitelist**
- [ ] **Option A (Quick, for testing):**
  - Click **Add IP Address**
  - Enter: `0.0.0.0/0` (Allow access from anywhere)
  - Click **Confirm**
  - ⚠️ After testing, rotate DB password and tighten access.

- [ ] **Option B (Recommended for production):**
  - Set up **Private Endpoint** or **VPC Peering** between Atlas and your cloud provider.
  - Follow: https://www.mongodb.com/docs/atlas/private-endpoint/

## Vercel Deployment

- [ ] Push code to GitHub:
  ```
  git add .
  git commit -m "Ready for Vercel deployment"
  git push origin main
  ```

- [ ] Go to [Vercel](https://vercel.com/) and create a new project
- [ ] Import your GitHub repo: `AshishKumar117/React-ResumeAI`
- [ ] In **Settings → Environment Variables**, add:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = (from Clerk)
  - `CLERK_SECRET_KEY` = (from Clerk)
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
  - `MONGODB_URL` = (same as local, with URL-encoded password)
  - `GEMINI_API_KEY` = (from Google AI Studio)
  - `BASE_URL` = `https://your-vercel-domain.vercel.app` (set after first deployment)
  - `HEALTH_ENDPOINT_SECRET` = (a strong random secret, e.g., use https://1password.com/password-generator/)

- [ ] Click **Deploy**
- [ ] Wait for build to complete (watch the build logs)

## Post-Deployment Verification

- [ ] Test the health endpoint (verify MongoDB connectivity from Vercel):
  ```powershell
  curl.exe -H "x-health-secret: YOUR_SECRET" https://your-vercel-domain.vercel.app/api/health -v
  ```
  Expected response: `{"ok":true,...}` or similar JSON without error.

- [ ] Visit your Vercel URL and test:
  - [ ] Sign in / Sign up (Clerk auth)
  - [ ] Create a new resume
  - [ ] Fill out resume sections (personal details, experience, education, skills)
  - [ ] Download/export resume
  - [ ] Delete a resume

## If MongoDB Connection Fails on Vercel

1. **Check Vercel logs:**
   - Go to Vercel → Deployments → select latest → Function Logs
   - Look for: "Attempting to connect to MongoDB..." and connection errors.

2. **Verify environment variables:**
   - Ensure `MONGODB_URL` is correct in Vercel Settings.
   - Ensure password special chars are URL-encoded.

3. **Check Atlas whitelist:**
   - If you're using `0.0.0.0/0`, it should work (might take 1–2 min to propagate).
   - If using Private Endpoint, verify network configuration.

4. **Test from your machine:**
   ```
   node scripts/check-db.js
   ```
   If this works locally but not on Vercel, the issue is Atlas IP whitelist, not connection string.

## Security Notes

- ⚠️ **Never commit `.env.local` or real secrets to GitHub.** It's in `.gitignore`.
- Use `.env.example` as a template for required variables.
- Rotate credentials regularly.
- If you used `0.0.0.0/0` for testing, rotate the MongoDB password and set up VPC peering / Private Endpoint for production.

## Useful Links

- Clerk Docs: https://clerk.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Google Generative AI: https://ai.google.dev/
- Vercel Docs: https://vercel.com/docs
- Full Deployment Guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for more detailed troubleshooting.
