import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/app/utils/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return;

  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");
  const id = searchParams.get("id");
  const includeDeleted = searchParams.get("includeDeleted") === "true";

  const client = await getMongoClient();
  const db = client.db();

  try {
    const user = await db?.collection("users").findOne({
      email: email,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userId = user?._id;

    let data;
    if (id) {
      data = await db?.collection("programs").findOne({
          userId,
          _id: new ObjectId(id),
      });
      if (data) {
        data = {
          ...data,
          _id: data._id.toString(),
          userId: data.userId.toString(),
        };
      }
    } else {
      const result = await db
          ?.collection("programs")
          .find({
            userId: userId,
            ...(!includeDeleted && {
              deleted: { $ne: true },
            }),
          })
          .sort({
            lastCompletedAt: -1,
          })
          .toArray();
      data = result.map((item) => ({
        ...item,
        _id: item._id.toString(),
        userId: item.userId.toString(),
      }));
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("fetch failed", error);
  }
}
