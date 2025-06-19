import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/app/utils/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return;
  const client = await getMongoClient();
  const db = client.db();
  try {
    const result = await db.collection("exercises").find({}).toArray();
    const data = result.map((item) => ({ ...item, _id: item._id.toString() }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("error occurs!", error);
  }
}
