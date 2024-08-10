"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { MongoClient } from "mongodb";
import { RegisteredProgram } from "../types";

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

    const result = await db
      ?.collection("programs")
      .find({
        userId: userId,
      })
      .toArray();

    return result as unknown as RegisteredProgram[];
  } catch (error) {
    console.log("fetch failed", error);
  }

  client?.close();
}

export { getData as getPrograms };
