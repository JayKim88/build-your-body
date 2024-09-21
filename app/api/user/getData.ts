"use server";

import { getServerSession } from "next-auth";
import { MongoClient } from "mongodb";

import { authOptions } from "../auth/[...nextauth]/authOptions";

const uri = process.env.MONGODB_URI ?? "";

async function getData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const client = new MongoClient(uri);
  const db = client?.db();

  try {
    const user = await db?.collection("users").findOne({
      email: session?.user?.email,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userId = user?._id;
    return userId;
  } catch (error) {
    console.log("fetch failed", error);
    return null;
  }
}

export { getData as getUserId };
