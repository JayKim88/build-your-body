import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import {
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";

import { HistoryChartData, WorkoutHistory } from "../types";

const uri = process.env.MONGODB_URI ?? "";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return;

  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");
  const workoutId = searchParams.get("workoutId");
  const programId = searchParams.get("programId");
  const endDate = searchParams.get("endDate");
  const targetDate = searchParams.get("targetDate");
  const targetMonthDate = searchParams.get("targetMonthDate");
  const lastWorkout = searchParams.get("lastWorkout") === "true";
  const isPublic = searchParams.get("isPublic") === "true";

  const client = new MongoClient(uri);
  const db = client?.db();

  const now = new Date();
  const timeZoneDifference = -new Date().getTimezoneOffset() / 60;

  try {
    let userId;

    if (!isPublic) {
      const user = await db?.collection("users").findOne({
        email: email,
      });

      if (!user) {
        throw new Error("User not found");
      }

      userId = user?._id;
    }

    let data;

    if (workoutId) {
      // get specific program history data
      data = await db?.collection("workout-performance").findOne({
        userId,
        _id: new ObjectId(workoutId),
      });
    } else if (programId) {
      // get available programs history within a specific week

      const dataFromDB = await db
        ?.collection("workout-performance")
        .aggregate([
          {
            $match: {
              userId,
              savedProgramId: programId,
              completedAt: {
                $gte: subDays(
                  endDate ? new Date(endDate) : now,
                  6
                ).toISOString(),
                $lte: endDate
                  ? new Date(endDate).toISOString()
                  : now.toISOString(),
              },
            },
          },
          {
            $addFields: {
              completedAtDate: {
                $dateFromString: { dateString: "$completedAt" },
              },
            },
          },
          {
            $addFields: {
              completedAtLocalTime: {
                $dateAdd: {
                  startDate: "$completedAtDate",
                  unit: "hour",
                  amount: timeZoneDifference, // Adjust completedAtDate to local time
                },
              },
            },
          },
          {
            $sort: {
              completedAtLocalTime: -1, // Sort by localized time
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$completedAtLocalTime",
                },
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
            $limit: lastWorkout ? 1 : 7,
          },
        ])
        .toArray();

      const groupedByExercise: HistoryChartData = [];

      (dataFromDB as WorkoutHistory).forEach((h) => {
        const date = h._id;
        const exercisesOnThisDate: {
          name: string;
          type: string;
          item: { date: string; lift: number };
        }[] = [];

        h.items.forEach((item) => {
          const singlePerformance = item;
          singlePerformance.savedExercisesStatus.forEach((status) => {
            const name = status.name;
            const type = status.type;
            const lift = status.exerciseSetValues.reduce(
              (acc, cur) => acc + (cur.repeat ?? 0) * (cur.weight ?? 0),
              0
            );

            const target = exercisesOnThisDate.find(
              (exercise) => exercise.name === name
            );

            if (target) {
              target.item.lift = target.item.lift + lift;
            } else {
              exercisesOnThisDate.push({
                name: name,
                type: type,
                item: {
                  date: date,
                  lift: lift,
                },
              });
            }
          });
        });

        exercisesOnThisDate.forEach(({ item, ...rest }) => {
          const target = groupedByExercise.find((g) => g.name === rest.name);

          if (target) {
            target.items.push(item);
          } else {
            groupedByExercise.push({
              ...rest,
              items: [item],
            });
          }
        });
      });

      data = groupedByExercise;
    } else if (targetMonthDate) {
      // get dates having program history for a specific month
      const startofMonth = startOfMonth(targetMonthDate).toISOString();
      const endofMonth = endOfMonth(targetMonthDate).toISOString();

      const dataAvailableInTargetMonth = await db
        ?.collection("workout-performance")
        .aggregate([
          {
            $match: {
              userId,
              completedAt: {
                $gte: startofMonth,
                $lte: endofMonth,
              },
            },
          },
          {
            $addFields: {
              completedAtDate: {
                $dateFromString: { dateString: "$completedAt" },
              },
            },
          },
          {
            $addFields: {
              completedAtLocalTime: {
                $dateAdd: {
                  startDate: "$completedAtDate",
                  unit: "hour",
                  amount: timeZoneDifference,
                },
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$completedAtLocalTime",
                },
              },
              items: {
                $push: "$$ROOT",
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ])
        .toArray();

      data = dataAvailableInTargetMonth.map((item) => item._id);
    } else if (isPublic) {
      data = await db
        ?.collection("workout-performance")
        .find({
          isPublic: true,
        })
        .sort({
          completedAt: -1,
        })
        .toArray();
    } else {
      // find all or specific date programs history

      const startUTC = targetDate
        ? new Date(
            Date.UTC(
              new Date(targetDate).getUTCFullYear(),
              new Date(targetDate).getUTCMonth(),
              new Date(targetDate).getUTCDate()
            )
          ).toISOString()
        : now.toISOString();
      const endUTC = targetDate
        ? new Date(
            Date.UTC(
              new Date(targetDate).getUTCFullYear(),
              new Date(targetDate).getUTCMonth(),
              new Date(targetDate).getUTCDate(),
              23,
              59,
              59,
              999
            )
          ).toISOString()
        : now.toISOString();

      console.log("startUTC", startUTC);
      console.log("endUTC", endUTC);

      /**
       * @todo vercel 에서 데이터 못 찾아오고 있음. 수정필요. 로그찍어보기.
       */

      data = await db
        ?.collection("workout-performance")
        .find({
          userId: userId,
          ...(targetDate && {
            completedAt: {
              $gte: startUTC,
              $lte: endUTC,
            },
          }),
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
