require('dotenv').config({ path: '.env' });
const { MongoClient, ObjectId } = require('mongodb');

async function seedData() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'comments_app';

  if (!uri) {
    throw new Error('❌ MONGODB_URI not found in .env.local');
  }

  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected!');

    const db = client.db(dbName);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('comments').deleteMany({});
    await db.collection('comment_likes').deleteMany({});
    await db.collection('reply_likes').deleteMany({});

    // Define comments
    const comment1Id = new ObjectId();
    const reply1Id = new ObjectId();
    const comment2Id = new ObjectId();
    const comment3Id = new ObjectId();

    const sampleComments = [
      {
        _id: comment1Id,
        name: "Alice Johnson",
        text: "This is a great article! Really helpful insights about LangGraph.",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 8,
        userId: "user_101",
        articleId: "article_1",
        replies: [
          {
            _id: reply1Id,
            name: "Bob Smith",
            text: "I agree! The BigQuery integration part was especially useful.",
            time: new Date(Date.now() - 1 * 60 * 60 * 1000),
            likes: 3,
            parentId: comment1Id.toString(),
            userId: "user_102",
          }
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        _id: comment2Id,
        name: "Charlie Davis",
        text: "Thanks for sharing this! I've been looking for exactly this kind of tutorial.",
        time: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: 12,
        userId: "user_103",
        articleId: "article_1",
        replies: [],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        _id: comment3Id,
        name: "Diana Wilson",
        text: "Could you please add more examples about error handling?",
        time: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 5,
        userId: "user_104",
        articleId: "article_1",
        replies: [],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      }
    ];

    // Insert comments
    console.log('📝 Inserting sample comments...');
    const commentResult = await db.collection('comments').insertMany(sampleComments);
    console.log(`✅ Inserted ${commentResult.insertedCount} comments`);

    // Insert comment likes
    const sampleLikes = [
      { commentId: comment1Id, userId: "user_105", createdAt: new Date() },
      { commentId: comment1Id, userId: "user_106", createdAt: new Date() },
      { commentId: comment2Id, userId: "user_105", createdAt: new Date() },
      { commentId: comment2Id, userId: "user_107", createdAt: new Date() },
      { commentId: comment3Id, userId: "user_108", createdAt: new Date() },
    ];

    console.log('👍 Inserting sample comment likes...');
    const likesResult = await db.collection('comment_likes').insertMany(sampleLikes);
    console.log(`✅ Inserted ${likesResult.insertedCount} comment likes`);

    // Insert reply likes
    const sampleReplyLikes = [
      { replyId: reply1Id, userId: "user_109", createdAt: new Date() },
      { replyId: reply1Id, userId: "user_110", createdAt: new Date() }
    ];

    console.log('💬 Inserting sample reply likes...');
    const replyLikesResult = await db.collection('reply_likes').insertMany(sampleReplyLikes);
    console.log(`✅ Inserted ${replyLikesResult.insertedCount} reply likes`);

    // Done
    console.log('🎉 Sample data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Comments: ${commentResult.insertedCount}`);
    console.log(`- Comment Likes: ${likesResult.insertedCount}`);
    console.log(`- Reply Likes: ${replyLikesResult.insertedCount}`);
    console.log(`- Database: ${db.databaseName}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await client.close();
    console.log('🔒 Connection closed.');
  }
}

seedData();
