"use server";

import { getServerSession } from "next-auth";
import { MongoClient, ObjectId } from "mongodb";

import { authOptions } from "../auth/[...nextauth]/authOptions";

const uri = process.env.MONGODB_URI ?? "";

async function deleteProgram(id: string) {
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

    const result = await db?.collection("programs").deleteOne({
      _id: new ObjectId(id),
      userId: userId,
    });

    const plainResult = {
      success: result.acknowledged,
      count: result.deletedCount, // Convert ObjectId to string
    };

    return plainResult;
  } catch (error) {
    console.log("fetch failed", error);
  }

  client?.close();
}

export { deleteProgram };
