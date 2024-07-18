import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const responseExample = ["hey", "hello"];

export async function GET(req: NextApiRequest) {
  if (req.method === "GET") {
    return NextResponse.json({ exercises: responseExample }, { status: 200 });
  }
}
