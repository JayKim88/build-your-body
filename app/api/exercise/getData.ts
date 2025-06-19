"use server";

import { getMongoClient } from "@/app/utils/mongoClient";
import { ObjectId } from "mongodb";
import { Exercise } from "../types";

async function getData(id: string) {
  const client = await getMongoClient();
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
  }
}

export { getData as getExerciseData };
