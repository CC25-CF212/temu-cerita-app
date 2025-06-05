// // // lib/mongodb.ts
// // import { MongoClient, Db } from 'mongodb';

// // if (!process.env.MONGODB_URI) {
// //   throw new Error('Please add your Mongo URI to .env.local');
// // }

// // const uri: string = process.env.MONGODB_URI;
// // const options = {};

// // let client: MongoClient;
// // let clientPromise: Promise<MongoClient>;

// // if (process.env.NODE_ENV === 'development') {
// //   // In development mode, use a global variable so that the value
// //   // is preserved across module reloads caused by HMR (Hot Module Replacement).
// //   let globalWithMongo = global as typeof globalThis & {
// //     _mongoClientPromise?: Promise<MongoClient>;
// //   };

// //   if (!globalWithMongo._mongoClientPromise) {
// //     client = new MongoClient(uri, options);
// //     globalWithMongo._mongoClientPromise = client.connect();
// //   }
// //   clientPromise = globalWithMongo._mongoClientPromise;
// // } else {
// //   // In production mode, it's best to not use a global variable.
// //   client = new MongoClient(uri, options);
// //   clientPromise = client.connect();
// // }

// // // Export a module-scoped MongoClient promise. By doing this in a
// // // separate module, the client can be shared across functions.
// // export default clientPromise;

// // // Helper function to get database
// // export async function getDatabase(): Promise<Db> {
// //   const client = await clientPromise;
// //   return client.db(process.env.MONGODB_DB);
// // }

// // lib/mongodb/mongodb.ts
// import { MongoClient, Db } from 'mongodb';

// const uri = process.env.MONGODB_URI;
// const dbName = process.env.MONGODB_DB || 'db_artikel_comment';

// if (!uri) {
//   throw new Error('Please add your MongoDB URI to .env.local');
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === 'development') {
//   if (!(global as any)._mongoClientPromise) {
//     client = new MongoClient(uri);
//     (global as any)._mongoClientPromise = client.connect();
//   }
//   clientPromise = (global as any)._mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export async function getDatabase(): Promise<Db> {
//   const client = await clientPromise;
//   return client.db(dbName);
// }


// lib/mongodb/mongodb.ts
import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'db_artikel_comment';

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Options khusus untuk Vercel deployment
const options: MongoClientOptions = {
  // SSL/TLS configuration untuk Vercel
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  
  // Connection timeout settings
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 30000,
  
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 1,
  
  // Retry settings
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default clientPromise;