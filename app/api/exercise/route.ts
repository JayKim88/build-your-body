import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/app/utils/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return;

  const { searchParams } = new URL(req.url, "http://localhost");

  const exerciseId = searchParams.get("exerciseId");

  if (exerciseId) {
    const client = await getMongoClient();
    const db = client.db();
    try {
      const data = await db?.collection("exercises").findOne({
        _id: new ObjectId(exerciseId),
      });

      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.log("error occurs!", error);
      return NextResponse.json(
        { error: "Invalid exerciseId format" },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "exerciseId not provided" },
      { status: 400 }
    );
  }
}
