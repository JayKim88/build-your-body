"use server";

import { CartProps } from "@/app/store";
import { getServerSession } from "next-auth";
import { MatchKeysAndValues, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getMongoClient } from "@/app/utils/mongoClient";

import { authOptions } from "../auth/[...nextauth]/authOptions";

async function editProgram(data: {
  programId: string;
  lastCompletedAt?: string;
  exercises?: CartProps[];
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
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
      message: "프로그램이 성공적으로 수정되었어요.",
    };

    revalidatePath("/programs");

    return plainResult;
  } catch (error) {
    console.log("fetch failed", error);
  }
}

export { editProgram };
