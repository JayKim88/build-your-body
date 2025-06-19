"use server";

import { getMongoClient } from "@/app/utils/mongoClient";
import { MyStat } from "../types";

async function getData() {
  const client = await getMongoClient();
  const db = client.db();

  try {
    const result = await db
      .collection("workout-performance")
      .find({ isPublic: true })
      .sort({ completedAt: -1 })
      .toArray();

    const formattedData = (result as unknown as MyStat[])?.map(
      ({ _id, ...rest }) => ({
        ...rest,
        _id: _id.toString(),
      })
    );

    return formattedData;
  } catch (error) {
    console.log("fetch failed", error);
    return null;
  }
}

export { getData as getCommunitiesList };
