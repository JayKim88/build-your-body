import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { HistoryChartData, WorkoutHistory } from "../types";

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
      const dataFromDB = await db
        ?.collection("workout-performance")
        .aggregate([
          {
            $match: {
              userId,
              savedProgramId: programId,
            },
          },
          {
            $sort: {
              completedAt: -1,
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$completedAt" },
              },
              items: {
                $push: "$$ROOT",
              },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 7,
          },
        ])
        .toArray();

      const groupedByDate: {
        date: string;
        items: {
          name: string;
          type: string;
          lift: number;
        }[];
      }[] = [];

      (dataFromDB as WorkoutHistory).forEach((h) => {
        const date = h._id;
        const resultItems: { name: string; lift: number; type: string }[] = [];

        h.items.forEach((item) => {
          item.savedExercisesStatus.forEach((status) => {
            const name = status.name;
            const type = status.type;
            const lift = status.exerciseSetValues.reduce(
              (acc, cur) => acc + (cur.repeat ?? 0) * (cur.weight ?? 0),
              0
            );

            const target = resultItems.find((t) => t.name === name);

            if (target) {
              target.lift = target.lift + lift;
            } else {
              resultItems.push({
                name: name,
                type: type,
                lift: lift,
              });
            }
          });
        });

        groupedByDate.push({
          date: date,
          items: resultItems,
        });
      });

      const groupedByName: HistoryChartData = [];

      groupedByDate.forEach((v) => {
        const date = v.date;

        v.items.forEach((item) => {
          const target = groupedByName.find((fi) => fi.name === item.name);

          if (target) {
            target.items.push({
              date: date,
              lift: item.lift,
            });
          } else {
            groupedByName.push({
              name: item.name,
              type: item.type,
              items: [
                {
                  date: date,
                  lift: item.lift,
                },
              ],
            });
          }
        });
      });

      data = groupedByName;
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
  } finally {
    client?.close();
  }
}
