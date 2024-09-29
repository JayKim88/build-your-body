"use server";

import { CartProps } from "@/app/store";
import { getServerSession } from "next-auth";
import { MatchKeysAndValues, MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import { authOptions } from "../auth/[...nextauth]/authOptions";

const uri = process.env.MONGODB_URI ?? "";

async function editProgram(data: {
  programId: string;
  lastCompletedAt?: Date;
  exercises?: CartProps[];
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

    const { lastCompletedAt, programId, exercises } = data;

    const updateFields: MatchKeysAndValues<Document> | undefined = {};

    if (exercises) {
      updateFields.exercises = exercises;
    }
    if (lastCompletedAt) {
      updateFields.lastCompletedAt = lastCompletedAt;
    }

    const result = await db?.collection("programs").updateOne(
      {
        _id: new ObjectId(programId),
        userId,
      },
      {
        $set: updateFields,
      }
    );

    const plainResult = {
      success: result.acknowledged,
      itemId: result.modifiedCount.toString(), // Convert ObjectId to string
    };

    revalidatePath("/programs");

    return plainResult;
  } catch (error) {
    console.log("fetch failed", error);
  } finally {
    client?.close();
  }
}

export { editProgram };
