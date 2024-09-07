"use server";

import { getServerSession } from "next-auth";
import { MongoClient } from "mongodb";
import { revalidatePath } from "next/cache";

import { CartProps } from "@/app/store";
import { authOptions } from "../auth/[...nextauth]/authOptions";

const uri = process.env.MONGODB_URI ?? "";

async function registerProgram(data: {
  programName: string;
  exercises: CartProps[];
}) {
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

    const newUserProgram = {
      userId,
      ...data,
    };

    const result = await db?.collection("programs").insertOne(newUserProgram);

    const plainResult = {
      success: result.acknowledged,
      itemId: result.insertedId.toString(), // Convert ObjectId to string
    };

    revalidatePath("/programs");

    return plainResult;
  } catch (error) {
    console.log("fetch failed", error);
    // return { data: [] }; // maybe error occurs in the future.
  }

  client?.close();
}

export { registerProgram };
