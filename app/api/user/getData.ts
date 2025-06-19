"use server";

import { getServerSession } from "next-auth";
import { getMongoClient } from "@/app/utils/mongoClient";
import { authOptions } from "../auth/[...nextauth]/authOptions";

async function getData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const client = await getMongoClient();
  const db = client.db();

  try {
    const user = await db?.collection("users").findOne({
      email: session?.user?.email,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userId = user?._id;
    return userId.toString();
  } catch (error) {
    console.log("fetch failed", error);
    return null;
  }
}

export { getData as getUserId };
