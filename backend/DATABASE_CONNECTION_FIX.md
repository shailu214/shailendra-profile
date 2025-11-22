# Database Connection Fix Guide

Your backend is running, but it cannot connect to the database. This is a common issue when deploying to Vercel.

## The Problem
1. **Missing Environment Variable**: Vercel doesn't know your MongoDB connection string (`MONGODB_URI`).
2. **IP Blocking**: MongoDB Atlas blocks connections from unknown IPs (like Vercel's servers) by default.

## Step 1: Get Your Connection String
1. Open your local `backend/.env` file (if you have one).
2. Copy the value of `MONGODB_URI`.
   - It should look like: `mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net/myportfolio?retryWrites=true&w=majority`

## Step 2: Add to Vercel
1. Go to your **Vercel Dashboard**.
2. Select your **Backend Project** (`myportfolio-backend`).
3. Go to **Settings** > **Environment Variables**.
4. Add a new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: (Paste your connection string from Step 1)
5. Click **Save**.

## Step 3: Whitelist Vercel IPs in MongoDB Atlas
Vercel uses dynamic IP addresses, so you need to allow access from anywhere.

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Click **Network Access** in the left sidebar.
3. Click **+ Add IP Address**.
4. Click **Allow Access from Anywhere** (or enter `0.0.0.0/0`).
5. Click **Confirm**.
   - *Note: This is safe for your portfolio if you have a strong password.*

## Step 4: Redeploy
After changing environment variables, you must redeploy for them to take effect.

1. Go to the **Deployments** tab in Vercel.
2. Click the **three dots** (...) on the latest deployment.
3. Select **Redeploy**.
4. Wait for it to finish.

## Verification
Once redeployed, visit your health endpoint again:
[https://myportfolio-backend-shailu214s-projects.vercel.app/api/health](https://myportfolio-backend-shailu214s-projects.vercel.app/api/health)

You should see:
```json
"database": {
  "status": "Connected",
  "name": "myportfolio" 
}
```
