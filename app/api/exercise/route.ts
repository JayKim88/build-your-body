import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const uri = process.env.MONGODB_URI ?? "";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return;

  const { searchParams } = new URL(req.url);

  const exerciseId = searchParams.get("exerciseId");

  let client: MongoClient;

  if (exerciseId) {
    client = new MongoClient(uri);
    const db = client?.db();
    try {
      const data = await db?.collection("exercises").findOne({
        _id: new ObjectId(exerciseId),
      });

      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.log("error occurs!", error);
    } finally {
      client?.close();
    }
  } else {
    return NextResponse.json(
      { error: "exerciseId not provided" },
      { status: 400 }
    );
  }
}
