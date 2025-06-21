import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
let client: MongoClient | null = null;

export async function getMongoClient() {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
    }

    await client.db().admin().ping();

    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error);

    client = null;
    throw error;
  }
}
