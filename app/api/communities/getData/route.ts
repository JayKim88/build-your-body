import { NextResponse } from "next/server";
import { getCommunitiesList } from "../getData";

export async function GET() {
  const data = await getCommunitiesList();
  return NextResponse.json(data, { status: 200 });
}
