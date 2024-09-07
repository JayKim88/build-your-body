import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const uri = process.env.MONGODB_URI ?? "";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return;

  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");
  const workoutId = searchParams.get("workoutId");
  const programId = searchParams.get("programId");

  const client = new MongoClient(uri);
  const db = client?.db();

  try {
    const user = await db?.collection("users").findOne({
      email: email,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userId = user?._id;

    let data;

    if (workoutId) {
      data = await db?.collection("workout-performance").findOne({
        userId,
        _id: new ObjectId(workoutId),
      });
    } else if (programId) {
      data = await db
        ?.collection("workout-performance")
        .find({
          userId,
          savedProgramId: programId,
        })
        .sort({
          createdAt: -1,
        })
        .limit(7)
        .toArray();
    } else {
      data = await db
        ?.collection("workout-performance")
        .find({
          userId: userId,
        })
        .toArray();
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("fetch failed", error);
  }

  client?.close();
}
