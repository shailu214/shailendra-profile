# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended for Development)

### 1. Create MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (select the free tier)
4. Wait for cluster creation (3-5 minutes)

### 2. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `portfoliouser`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 3. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### 4. Get Connection String
1. Go to "Database" (Clusters)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `myFirstDatabase` with `portfolio-website`

### 5. Update .env File
Replace the MONGODB_URI in your .env file with the Atlas connection string:
```
MONGODB_URI=mongodb+srv://portfoliouser:<password>@cluster0.xxxxx.mongodb.net/portfolio-website?retryWrites=true&w=majority
```

## Option 2: Local MongoDB with Docker

If you have Docker installed, you can run MongoDB locally:

```bash
# Run MongoDB in Docker
docker run --name mongodb-portfolio -p 27017:27017 -d mongo:latest

# The connection string remains:
# MONGODB_URI=mongodb://localhost:27017/portfolio-website
```

## Option 3: MongoDB Memory Server (for testing)

For development and testing, you can use an in-memory MongoDB instance:

```bash
npm install --save-dev mongodb-memory-server
```

This will be automatically used in test environments.

## After Setup

1. Update your `.env` file with the correct MongoDB URI
2. Run the seed script to populate initial data:
   ```bash
   npm run seed
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## Admin Login Credentials

After seeding, you can log in to the admin panel with:
- **Email:** admin@portfolio.com
- **Password:** admin123

**Important:** Change these credentials in production!

## Troubleshooting

### Connection Issues
- Check your internet connection
- Verify the MongoDB URI in .env
- Ensure IP address is whitelisted in Atlas
- Check username/password are correct

### Atlas Free Tier Limitations
- 512 MB storage
- Shared CPU and RAM
- No backup/restore
- Perfect for development and small projects