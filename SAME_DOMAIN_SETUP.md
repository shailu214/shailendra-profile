# How to Host Frontend & Backend on the Same Domain

You want to use `shailendrachaurasia.com` for BOTH your frontend and backend.
Currently, your frontend is likely at `shailendrachaurasia.com`, but your backend is at a different URL (like `myportfolio-backend...vercel.app`).

To make them work together on the same domain (e.g., `shailendrachaurasia.com/api/...`), you need to use **Vercel Rewrites**.

## Step 1: Get Your Backend URL
1. Go to your Vercel Dashboard.
2. Find your **Backend Project**.
3. Copy the **Production Deployment URL** (e.g., `https://myportfolio-backend-shailu214s-projects.vercel.app`).
   *Do not include the trailing slash.*

## Step 2: Configure Frontend Rewrites
You need to tell your Frontend to send any request starting with `/api` to your Backend.

1. Open `frontend/vercel.json`.
2. Update it to look like this (replace the destination with YOUR backend URL):

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://myportfolio-backend-shailu214s-projects.vercel.app/api/:path*"
    },
    {
      "source": "/uploads/:path*",
      "destination": "https://myportfolio-backend-shailu214s-projects.vercel.app/uploads/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Explanation:**
- `/api/:path*` -> Redirects all API calls to your backend.
- `/uploads/:path*` -> Redirects image loads to your backend.
- `/(.*)` -> Sends everything else to your React app (for routing).

## Step 3: Update Frontend Environment Variable
Now that your frontend is proxying requests, you should point your API URL to the *relative* path (or the same domain).

1. Go to your **Frontend Project** in Vercel.
2. Go to **Settings** > **Environment Variables**.
3. Update `VITE_API_URL`:
   - **Value**: `/api` (or `https://shailendrachaurasia.com/api`)
4. Save.

## Step 4: Redeploy Frontend
1. Go to **Deployments**.
2. **Redeploy** your Frontend project.

## Verification
After redeploying:
1. Visit `https://shailendrachaurasia.com/api/health`.
   - It should show your backend health check (JSON response).
2. Visit your website. It should now be able to communicate with the backend seamlessly.
