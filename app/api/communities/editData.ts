"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "../auth/[...nextauth]/authOptions";
import { MongoClient, ObjectId } from "mongodb";

type EditCommunitiesListProps = {
  userId: string;
  performedProgramId: string;
  isLike: boolean;
};

const uri = process.env.MONGODB_URI ?? "";

async function editCommunitiesList({
  userId,
  performedProgramId,
  isLike,
}: EditCommunitiesListProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const client = new MongoClient(uri);
  const db = client?.db();

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
  } finally {
    client?.close();
  }
}

export { editCommunitiesList };
