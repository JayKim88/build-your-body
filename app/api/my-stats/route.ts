import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const uri = process.env.MONGODB_URI ?? "";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return;

  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");
  const id = searchParams.get("id");

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

    const data = id
      ? await db?.collection("workout-performance").findOne({
          userId,
          _id: new ObjectId(id),
        })
      : await db
          ?.collection("workout-performance")
          .find({
            userId: userId,
          })
          .toArray();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("fetch failed", error);
  }

  client?.close();
}
