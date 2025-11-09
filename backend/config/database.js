const mongoose = require('mongoose');

// Only require MongoMemoryServer in development/testing
let MongoMemoryServer, mongod = null;

if (process.env.NODE_ENV !== 'production') {
  try {
    MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
  } catch (error) {
    console.log('📦 MongoMemoryServer not available (production build)');
  }
}

const connectDB = async () => {
  try {
    let mongoUri;

    if (process.env.NODE_ENV === 'test' || process.env.USE_MEMORY_DB === 'true') {
      // Use MongoDB Memory Server for testing only
      if (MongoMemoryServer) {
        mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log('🧠 Using MongoDB Memory Server for testing');
      } else {
        throw new Error('MongoMemoryServer not available. Install mongodb-memory-server for testing.');
      }
    } else {
      // Use the MongoDB URI from environment variables
      mongoUri = process.env.MONGODB_URI;
      
      if (!mongoUri) {
        console.error('❌ MONGODB_URI environment variable is not set');
        throw new Error('MONGODB_URI environment variable is required');
      }
      
      if (mongoUri.includes('localhost') && process.env.NODE_ENV !== 'production' && MongoMemoryServer) {
        // Only use memory server in development if localhost is specified and available
        console.log('🔄 Local development: Using Memory Server...');
        mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log('🧠 Using MongoDB Memory Server for local development');
      } else {
        console.log('🌐 Connecting to MongoDB Atlas...');
      }
    }

    // Optimize connection settings for serverless environment
    const connectionOptions = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      maxPoolSize: process.env.NODE_ENV === 'production' ? 5 : 10, // Smaller pool for serverless
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'production' ? 10000 : 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      retryWrites: true,
    };

    const conn = await mongoose.connect(mongoUri, connectionOptions);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔐 MongoDB Disconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    
    // Only use memory server fallback in development, not production
    if (process.env.NODE_ENV !== 'production' && !process.env.USE_MEMORY_DB && MongoMemoryServer) {
      console.log('🔄 Development fallback: Attempting Memory Server...');
      try {
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        
        const conn = await mongoose.connect(fallbackUri, connectionOptions);

        console.log('✅ Development fallback: Connected to MongoDB Memory Server');
        return conn;
      } catch (fallbackError) {
        console.error('❌ Development fallback also failed:', fallbackError.message);
        throw fallbackError;
      }
    }
    
    // In production, don't fallback - fail fast and show the error
    console.error('🚨 Production MongoDB connection failed. Check MONGODB_URI environment variable.');
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    
    if (mongod) {
      await mongod.stop();
      mongod = null;
    }
    
    console.log('🔐 Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
};

// Graceful shutdown (commented out to prevent premature shutdowns during development)
// process.on('SIGINT', async () => {
//   console.log('\n🔄 Gracefully shutting down...');
//   await disconnectDB();
//   process.exit(0);
// });

// process.on('SIGTERM', async () => {
//   console.log('\n🔄 Gracefully shutting down...');
//   await disconnectDB();
//   process.exit(0);
// });

module.exports = {
  connectDB,
  disconnectDB
};