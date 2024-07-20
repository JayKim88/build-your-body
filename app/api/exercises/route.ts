import { MongoClient } from "mongodb";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI ?? "";

export async function GET(req: NextApiRequest) {
  if (req.method !== "GET") return;

  const client = new MongoClient(uri);
  const db = client?.db();

  try {
    const data = await db?.collection("exercises").find({}).toArray();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("error occurs!", error);
  }

  client?.close();
}
