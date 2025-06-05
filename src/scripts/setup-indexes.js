require('dotenv').config();
const { MongoClient } = require('mongodb');

async function setupIndexes() {
  // Validate environment variables
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  if (!process.env.MONGODB_DB) {
    throw new Error('MONGODB_DB environment variable is not set');
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db(process.env.MONGODB_DB);
    
    // Index untuk comments collection
    console.log('Creating indexes for comments collection...');
    await db.collection('comments').createIndexes([
      { key: { articleId: 1, createdAt: -1 } }, // Query comments by article
      { key: { userId: 1 } }, // Query by user
      { key: { createdAt: -1 } } // Sort by date
    ]);
    
    // Index untuk comment_likes collection
    console.log('Creating indexes for comment_likes collection...');
    await db.collection('comment_likes').createIndexes([
      { key: { commentId: 1, userId: 1 }, options: { unique: true } }, // Prevent duplicate likes
      { key: { userId: 1 } }, // Query user's likes
      { key: { commentId: 1 } } // Count likes per comment
    ]);
    
    // Index untuk reply_likes collection
    console.log('Creating indexes for reply_likes collection...');
    await db.collection('reply_likes').createIndexes([
      { key: { replyId: 1, userId: 1 }, options: { unique: true } },
      { key: { userId: 1 } },
      { key: { replyId: 1 } }
    ]);
    
    console.log('All indexes created successfully!');
    
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

setupIndexes();