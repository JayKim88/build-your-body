"use server";

import { getMongoClient } from "@/app/utils/mongoClient";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/authOptions";
import { ExercisesStatus } from "@/app/my-programs/[programId]/Progress";
import { SatisfiedStatus } from "@/app/my-programs/complete/WorkoutSummary";
import { revalidatePath } from "next/cache";

export type PerfomanceData = {
  imageUrl?: string | undefined;
  savedProgramId: string;
  savedProgramName: string;
  savedExercisesStatus: ExercisesStatus;
  savedWorkoutTime: number;
  completedAt: string | undefined;
  satisfiedStatus: SatisfiedStatus;
  title: string;
  note: string;
  isPublic: boolean;
};

async function savePerformance(data: PerfomanceData) {
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

    const newWorkoutPerformance = {
      userId,
      ...data,
    };

    const result = await db
      ?.collection("workout-performance")
      .insertOne(newWorkoutPerformance);

    const plainResult = {
      success: result.acknowledged,
      itemId: result.insertedId.toString(),
    };

    revalidatePath("/communities");
    revalidatePath("/my-stats");

    return plainResult;
  } catch (error) {
    console.log("fetch failed", error);
  }
}

export { savePerformance };
