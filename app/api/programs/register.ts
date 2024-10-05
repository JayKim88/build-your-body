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
    const { programName, exercises } = data;

    const isSameNamedProgramExisting = await db
      ?.collection("programs")
      .findOne({
        userId,
        programName,
        deleted: { $ne: true },
      });

    if (!!isSameNamedProgramExisting) {
      const plainResult = {
        success: false,
        message: "동일한 이름의 프로그램이 있어요.",
      };

      return plainResult;
    }

    const result = await db?.collection("programs").insertOne({
      userId,
      programName,
      exercises,
    });

    const plainResult = {
      success: result.acknowledged,
      itemId: result.insertedId.toString(), // Convert ObjectId to string
      message: result.acknowledged
        ? "프로그램이 성공적으로 등록되었어요."
        : "에러가 발생했어요. 재시도 해주세요.",
    };

    plainResult.success && setTimeout(() => revalidatePath("/programs"), 1000);

    return plainResult;
  } catch (error) {
    console.log("fetch failed", error);
    // return { data: [] }; // maybe error occurs in the future.
  } finally {
    client?.close();
  }
}

export { registerProgram };
