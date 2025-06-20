"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getMongoClient } from "@/app/utils/mongoClient";

import { authOptions } from "../auth/[...nextauth]/authOptions";

type EditCommunitiesListProps = {
  userId: string;
  performedProgramId: string;
  isLike: boolean;
};

async function editCommunitiesList({
  userId,
  performedProgramId,
  isLike,
}: EditCommunitiesListProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const client = await getMongoClient();
  const db = client.db();

  const editCondition = isLike
    ? {
        $addToSet: {
          likedUserIds: userId,
        },
      }
    : {
        $pull: {
          likedUserIds: userId as any,
        },
      };

  try {
    const result = await db?.collection("workout-performance").updateOne(
      {
        _id: new ObjectId(performedProgramId!),
      },
      editCondition
    );

    const plainResult = {
      success: result.acknowledged,
    };

    plainResult.success && revalidatePath("/communities");

    return plainResult;
  } catch (error) {
    console.log("edit failed", error);
  }
}

export { editCommunitiesList };
