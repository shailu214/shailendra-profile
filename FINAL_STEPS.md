# ⚠️ CRITICAL: Final Steps for Same-Domain Setup

I have updated your code to support running everything on `shailendrachaurasia.com`.
**However, you MUST perform these steps in the Vercel Dashboard for it to work.**

## Step 1: Fix Backend Domain
1. Go to your **Backend Project** in Vercel (`myportfolio-backend`).
2. Go to **Settings** > **Domains**.
3. **REMOVE** `shailendrachaurasia.com` and `www.shailendrachaurasia.com`.
   - Your backend should ONLY have the default domain (e.g., `myportfolio-backend-....vercel.app`).

## Step 2: Update Frontend Environment Variable
1. Go to your **Frontend Project** in Vercel.
2. Go to **Settings** > **Environment Variables**.
3. Edit `VITE_API_URL`:
   - Change the value to: `/api`
4. Click **Save**.

## Step 3: Redeploy Frontend
1. Go to the **Deployments** tab in your Frontend project.
2. Click the **three dots** (...) on the latest deployment.
3. Select **Redeploy**.

## Verification
Once the redeployment is finished:
1. Visit `https://shailendrachaurasia.com`.
2. Your site should load, and it should be able to fetch data from the backend (which is now proxied behind `/api`).
