# Vercel Environment Variables Setup

## Required Environment Variables for Production Deployment

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

### 🗄️ **Database Configuration**
```bash
MONGODB_URI=mongodb+srv://shailendrachaurasia214:XCVDJhwe78263hG@cluster0.ura2q.mongodb.net/portfolio-website?retryWrites=true&w=majority
```

### 🔐 **JWT Configuration**
```bash
JWT_SECRET=your-super-secure-jwt-secret-key-32-chars-minimum-production-2024
JWT_EXPIRES_IN=7d
```

### 📧 **Email Configuration** 
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=shailendrachaurasia214@gmail.com
SMTP_PASS=your-gmail-app-password
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

### 📁 **File Upload Configuration**
```bash
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 🚦 **Rate Limiting**
```bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 **Deployment Steps**

1. **Set Environment Variables**: Go to Vercel Dashboard and add all the above variables
2. **Deploy**: Push changes to trigger new deployment
3. **Verify**: Check deployment logs for any errors
4. **Test**: Verify API endpoints are working

## 🔗 **MongoDB Atlas Setup**

Ensure your MongoDB Atlas cluster:
- ✅ Has the correct database name: `portfolio-website`
- ✅ Allows connections from Vercel (0.0.0.0/0 or specific IPs)
- ✅ Has the admin user created with the right credentials

## 🎯 **Production URLs**

- **Frontend**: https://myportfolio-nxkkfu9uk-shailu214s-projects.vercel.app
- **Backend**: https://myportfolio-backend-shailu214s-projects.vercel.app
- **API Base**: https://myportfolio-backend-shailu214s-projects.vercel.app/api

## 🔍 **Common Issues**

1. **MongoDB Connection**: Check Atlas IP whitelist and connection string
2. **CORS Errors**: Ensure CLIENT_URL matches frontend domain
3. **JWT Issues**: Make sure JWT_SECRET is set and secure
4. **File Uploads**: Vercel has limited file system, consider external storage