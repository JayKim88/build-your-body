"use server";

import { CartProps } from "@/app/store";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";

async function editProgram(data: {
  programId: string;
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

    const { programName, programId, exercises } = data;

    const result = await db?.collection("programs").updateOne(
      {
        _id: new ObjectId(programId),
        userId,
      },
      {
        $set: {
          programName,
          exercises,
        },
      }
    );

    const plainResult = {
      success: result.acknowledged,
      itemId: result.modifiedCount.toString(), // Convert ObjectId to string
    };

    return plainResult;
  } catch (error) {
    console.log("fetch failed", error);
    // return { data: [] }; // maybe error occurs in the future.
  }

  client?.close();
}

export { editProgram };
