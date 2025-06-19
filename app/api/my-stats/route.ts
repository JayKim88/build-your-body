import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import {
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";
import { getMongoClient } from "@/app/utils/mongoClient";
import { HistoryChartData, WorkoutHistory } from "../types";

/**
 * @description Date format is converted to UTC time in Server-Side (Node.js or Vercel)
 */

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return;

  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");
  const programId = searchParams.get("programId");
  const endDate = searchParams.get("endDate");
  const targetDate = searchParams.get("targetDate");
  const targetMonthDate = searchParams.get("targetMonthDate");
  const timeZoneDifference = searchParams.get("timeZoneDifference");
  const numberTimeZoneDifference = timeZoneDifference
    ? Number(timeZoneDifference)
    : 0;
  const lastWorkout = searchParams.get("lastWorkout") === "true";
  const isPublic = searchParams.get("isPublic") === "true";
  const lastCompletedAt = searchParams.get("lastCompletedAt");

  const client = await getMongoClient();
  const db = client.db();

  const now = new Date();

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

    if (programId && lastCompletedAt) {
      data = await db?.collection("workout-performance").findOne({
        userId,
        savedProgramId: programId,
        completedAt: lastCompletedAt,
      });
      if (data) {
        data._id = data._id.toString();
        data.userId = data.userId.toString();
      }
    } else if (programId) {
      const dateFrom = subDays(
        endDate ? startOfDay(endDate) : startOfDay(now),
        6
      ).toISOString();
      const dateTo = endDate
        ? endOfDay(endDate).toISOString()
        : endOfDay(now).toISOString();

      const dataFromDB = await db
        ?.collection("workout-performance")
        .aggregate([
          {
            $match: {
              userId,
              savedProgramId: programId,
              ...(!lastWorkout && {
                completedAt: {
                  $gte: dateFrom,
                  $lte: dateTo,
                },
              }),
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
                  amount: numberTimeZoneDifference, // Adjust completedAtDate to local time
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
                  amount: numberTimeZoneDifference,
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
      data = data.map((item) => ({
        ...item,
        _id: item._id.toString(),
        userId: item.userId?.toString?.(),
      }));
    } else {
      const startOfDayInUTC = targetDate;
      const endOfDayInUTC = new Date(
        new Date(targetDate!).getTime() + 24 * 60 * 60 * 1000 - 1
      ).toISOString();

      data = await db
        ?.collection("workout-performance")
        .find({
          userId,
          ...(targetDate && {
            completedAt: {
              $gte: startOfDayInUTC,
              $lte: endOfDayInUTC,
            },
          }),
        })
        .sort({
          completedAt: -1,
        })
        .toArray();
      data = data.map((item) => ({
        ...item,
        _id: item._id.toString(),
        userId: item.userId?.toString?.(),
      }));
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("fetch failed", error);
  }
}
