"use server";

import { getMongoClient } from "@/app/utils/mongoClient";
import { Exercise } from "../types";

async function getData() {
  try {
    const client = await getMongoClient();
    const db = client.db();
    const result = await db.collection("exercises").find({}).toArray();
    // TODO: Improve typing if needed
    const data = (result as any[]).map((item) => ({
      ...item,
      _id: item._id.toString(),
    })) as Exercise[];
    return { data };
  } catch (error) {
    console.log("fetch failed", error);
    return { data: [] };
  }
}

export { getData as getExercisesList };
