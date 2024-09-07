"use server";

import { CartProps } from "@/app/store";
import { getServerSession } from "next-auth";
import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import { authOptions } from "../auth/[...nextauth]/authOptions";

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

    revalidatePath("/programs");

    return plainResult;
  } catch (error) {
    console.log("fetch failed", error);
  }

  client?.close();
}

export { editProgram };
