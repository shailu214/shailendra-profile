# 🚀 Vercel Backend Deployment Guide

## 📋 **Environment Variables for Vercel Dashboard**

Copy these EXACT values to your Vercel Dashboard → Project → Settings → Environment Variables:

### 🗄️ **Database Configuration**
```bash
MONGODB_URI=mongodb+srv://shailendracannoneye_db_user:rQlsz17z6oSolOCb@cluster0.m0on7ls.mongodb.net/portfolio-website?retryWrites=true&w=majority&appName=Cluster0
```

### 🔐 **Security Configuration**
```bash
JWT_SECRET=portfolio-jwt-secret-key-2024-super-secure-production-32chars
JWT_EXPIRES_IN=7d
```

### 🌐 **CORS Configuration**
```bash
CLIENT_URL=https://myportfolio-nxkkfu9uk-shailu214s-projects.vercel.app
```

### ⚙️ **Server Configuration**
```bash
NODE_ENV=production
PORT=5000
```

### 📧 **Email Configuration** (Optional)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🔧 **MongoDB Atlas Setup Required**

### ❗ **Critical: IP Whitelist Issue**
Your MongoDB Atlas cluster is blocking connections. Fix this:

1. **Go to MongoDB Atlas Dashboard**
2. **Network Access** → **IP Access List**
3. **Add IP Address** → **Allow Access from Anywhere** → `0.0.0.0/0`
4. **Or add Vercel IPs specifically** (recommended for security)

### 🔗 **Vercel IP Addresses to Whitelist**
```
76.76.21.0/24
76.76.19.0/24
```

## 🚀 **Deployment Steps**

### **Step 1: Set Environment Variables**
1. Go to [Vercel Dashboard](https://vercel.com)
2. Find your backend project: `myportfolio-backend`
3. Settings → Environment Variables
4. Add each variable above (name and value)

### **Step 2: Fix MongoDB Access**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Network Access → IP Access List
3. Add `0.0.0.0/0` (allows all IPs)
4. Save changes

### **Step 3: Redeploy Backend**
1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy" on latest deployment
3. OR push a new commit to trigger deployment

### **Step 4: Verify Deployment**
Test these URLs after deployment:
- Root: `https://myportfolio-backend-shailu214s-projects.vercel.app/`
- Health: `https://myportfolio-backend-shailu214s-projects.vercel.app/api/health`
- Categories: `https://myportfolio-backend-shailu214s-projects.vercel.app/api/categories`

## 🔍 **Troubleshooting**

### **If "DEPLOYMENT_NOT_FOUND"**
- Check if backend project exists in Vercel Dashboard
- Verify project is connected to correct GitHub repo
- Ensure build directory is set to `backend/`

### **If MongoDB Connection Fails**
- Verify IP whitelist includes `0.0.0.0/0`
- Check MongoDB Atlas user has read/write permissions
- Verify connection string is exactly as shown above

### **If API Routes Don't Work**
- Check environment variables are set correctly
- Verify JWT_SECRET is set
- Check deployment logs for errors

## 📊 **Expected Results After Fix**

✅ Backend API accessible at Vercel URL  
✅ MongoDB connection working  
✅ Admin panel can connect to backend  
✅ Category management functional  

## 🎯 **Next Steps**

1. **Set all environment variables in Vercel**
2. **Fix MongoDB Atlas IP whitelist**
3. **Trigger new deployment**
4. **Test backend endpoints**
5. **Verify frontend admin panel works**