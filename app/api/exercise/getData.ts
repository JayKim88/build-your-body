"use server";

import { MongoClient, ObjectId } from "mongodb";
import { Exercise } from "../types";

const uri = process.env.MONGODB_URI ?? "";

async function getData(id: string) {
  // TODO: Use a shared MongoClient utility if available
  const client = new MongoClient(uri);
  const db = client.db();
  try {
    const data = await db.collection("exercises").findOne({
      _id: new ObjectId(id),
    });
    if (!data) return null;
    return { ...data, _id: data._id.toString() } as Exercise;
  } catch (error) {
    console.log("fetch failed", error);
    return null;
  } finally {
    await client.close();
  }
}

export { getData as getExerciseData };
