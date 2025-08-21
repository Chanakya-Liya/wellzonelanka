
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO environment variable");
}

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB");
    return mongoose;
  }

  await mongoose.connect(MONGODB_URI as string, {
    bufferCommands: false,
  });

  return mongoose;
}

export default connectToDatabase;
// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose: mongoose.Mongoose) => {
//       return mongoose;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export default dbConnect;