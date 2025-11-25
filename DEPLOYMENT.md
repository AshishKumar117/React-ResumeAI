# Deployment & MongoDB Atlas Guide

This document explains how to deploy the app to Vercel, configure environment variables, and fix common MongoDB Atlas connectivity issues.

---

## 1) Add environment variables on Vercel

Go to your project in Vercel -> Settings -> Environment Variables.
Add the following variables (Production & Preview & Development as needed):

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
- NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
- MONGODB_URL  (use the full SRV string; URL-encode password if it contains special characters)
- GEMINI_API_KEY
- BASE_URL (e.g., https://your-vercel-domain.vercel.app)
- HEALTH_ENDPOINT_SECRET (a random secret string used to secure /api/health)

Important: if your MongoDB password contains `@`, `:`, `/`, `%` or other special chars, URL-encode them. Example:

    password: AshuM@2004
    encoded:  AshuM%402004

Then your MONGODB_URL should look like:

    mongodb+srv://dbuser:AshuM%402004@cluster0.5ezbutt.mongodb.net/mydb?retryWrites=true&w=majority


## 2) Atlas network access (IP whitelist)

Because Vercel serverless functions run from dynamic IPs, you have two main options:

Option A — Quick (less secure but fast): Allow access from anywhere
1. In MongoDB Atlas, go to Network Access -> IP Whitelist -> Add IP Address
2. Enter `0.0.0.0/0` (Allow access from anywhere)
3. Click Confirm

Note: This makes your cluster reachable from anywhere. Keep a strong DB user/password and limit DB user privileges.

Option B — Recommended for production (more secure): Private Networking / VPC Peering
- Set up a Private Endpoint or VPC Peering between Atlas and your cloud provider (AWS/GCP/Azure) where your app runs.
- On Vercel, you may need to use a custom deployment on a VPC or use a cloud provider-managed network.
- Follow MongoDB Atlas docs: https://www.mongodb.com/docs/atlas/private-endpoint/

If you are testing quickly, choose Option A so Vercel can connect immediately.


## 3) Secure the health endpoint

A health endpoint was added at `/api/health`. It requires a header `x-health-secret` that matches the `HEALTH_ENDPOINT_SECRET` env var on the server.

Example (curl):

```powershell
curl -H "x-health-secret: YOUR_SECRET_HERE" https://your-vercel-domain.vercel.app/api/health
```

If you don't set `HEALTH_ENDPOINT_SECRET`, the endpoint will be open (not recommended). Set it in Vercel for safety.


## 4) Redeploy and verify

- Once env vars are set, trigger a redeploy in Vercel (or push an innocuous commit).
- Watch build logs in Vercel for runtime logs.
- Test the endpoint above.

Logs to look for (server-side):

- "Attempting to connect to MongoDB..."
- "MongoDB connected successfully"


## 5) If you still see "Could not connect to any servers in your MongoDB Atlas cluster"

- Double-check the `MONGODB_URL` (SRV/host, user, encoded password)
- Check Atlas Network Access: if you used `0.0.0.0/0` allowlist, wait a minute and try again.
- Ensure the DB user has correct role privileges and the username/password are correct.
- Test locally with the same MONGODB_URL to ensure connectivity.


## 6) After verification — lock down access

If you enabled `0.0.0.0/0` for a short test, once verified:
- Revoke `0.0.0.0/0` and consider using a more restricted approach (VPC peering). If you can't use VPC peering, at least rotate DB user credentials and restrict roles.


## 7) Useful links
- MongoDB Atlas Network Access: https://www.mongodb.com/docs/atlas/security-whitelist/
- Atlas Private Endpoint: https://www.mongodb.com/docs/atlas/private-endpoint/
- Vercel environment variables: https://vercel.com/docs/environment-variables


---

If you want, I can:
- Add a script to the repo that checks connectivity programmatically (already added `/api/health`).
- Add more runtime logging for connection attempts.

Next, I'll commit and push this file.
