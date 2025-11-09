# 🚀 Vercel Backend Deployment Setup

## 📋 Environment Variables to Set

Go to **Vercel Dashboard** → **Your Backend Project** → **Settings** → **Environment Variables**

### Required Variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://shailendracannoneye_db_user:rQlsz17z6oSolOCb@cluster0.m0on7ls.mongodb.net/portfolio-website?retryWrites=true&w=majority` | Production |
| `JWT_SECRET` | `portfolio-jwt-secret-key-2024-super-secure-production-32chars` | Production |
| `NODE_ENV` | `production` | Production |
| `CLIENT_URL` | `https://myportfolio-nxkkfu9uk-shailu214s-projects.vercel.app` | Production |
| `JWT_EXPIRES_IN` | `7d` | Production |

### Optional Variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `PORT` | `5000` | Production |
| `MAX_FILE_SIZE` | `5242880` | Production |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Production |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Production |

## 🎯 Step-by-Step Deployment

### 1. Set Environment Variables
```bash
# Using Vercel CLI (recommended)
cd backend
vercel env add MONGODB_URI production
# Paste: mongodb+srv://shailendracannoneye_db_user:rQlsz17z6oSolOCb@cluster0.m0on7ls.mongodb.net/portfolio-website?retryWrites=true&w=majority

vercel env add JWT_SECRET production
# Paste: portfolio-jwt-secret-key-2024-super-secure-production-32chars

vercel env add NODE_ENV production
# Type: production

vercel env add CLIENT_URL production
# Paste: https://myportfolio-nxkkfu9uk-shailu214s-projects.vercel.app
```

### 2. Deploy Backend
```bash
cd backend
vercel --prod
```

### 3. Test Deployment
```bash
# Test health endpoint
curl https://your-backend-url.vercel.app/api/health

# Test categories endpoint
curl https://your-backend-url.vercel.app/api/categories
```

## 🔍 Troubleshooting

### If "DEPLOYMENT_NOT_FOUND":
1. **Check Project Exists**: Verify backend project exists in Vercel dashboard
2. **Re-link Project**: Run `vercel --prod` in backend directory
3. **Check Environment Variables**: Ensure all variables are set
4. **Check Build Logs**: Look for errors in Vercel dashboard

### If MongoDB Connection Fails:
1. **Check Network Access**: MongoDB Atlas → Network Access → Add 0.0.0.0/0
2. **Verify Credentials**: Ensure username/password are correct
3. **Check Database Name**: Should be `portfolio-website`
4. **Test Connection**: Use MongoDB Compass or Atlas UI

### If CORS Errors:
1. **Verify CLIENT_URL**: Must match exact frontend domain
2. **Check Server Configuration**: Ensure CORS middleware is configured
3. **Test Both HTTP/HTTPS**: Frontend must use HTTPS in production

## 📊 Expected Results

After successful deployment:
- ✅ Backend health check works
- ✅ Categories API responds
- ✅ Frontend can access backend
- ✅ Admin panel login works
- ✅ Blog category management accessible

## 🔗 Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Open deployment in browser
vercel open

# Remove old deployments
vercel rm
```