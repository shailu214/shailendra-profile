const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let mongoUri;

    if (process.env.NODE_ENV === 'test' || process.env.USE_MEMORY_DB === 'true') {
      // Use MongoDB Memory Server for testing or when specified
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('🧠 Using MongoDB Memory Server');
    } else {
      // Use the MongoDB URI from environment variables or fallback to memory server
      mongoUri = process.env.MONGODB_URI;
      
      if (!mongoUri || mongoUri.includes('localhost')) {
        // If local MongoDB is not available, use memory server
        console.log('🔄 Local MongoDB not available, using Memory Server...');
        mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log('🧠 Using MongoDB Memory Server as fallback');
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

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
    
    // If Atlas connection fails, try memory server as fallback
    if (mongoUri !== process.env.MONGODB_URI && !process.env.USE_MEMORY_DB) {
      console.log('🔄 Attempting fallback to Memory Server...');
      try {
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        
        const conn = await mongoose.connect(fallbackUri, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        });

        console.log('✅ Fallback: Connected to MongoDB Memory Server');
        return conn;
      } catch (fallbackError) {
        console.error('❌ Fallback connection also failed:', fallbackError.message);
        throw fallbackError;
      }
    }
    
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