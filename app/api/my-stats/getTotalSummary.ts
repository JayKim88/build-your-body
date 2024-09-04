"use server";

import { getServerSession } from "next-auth";
import axios from "axios";

import { authOptions } from "../auth/[...nextauth]/authOptions";
import { MyStat, TotalWorkoutSummary } from "../types";

async function getData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
        params: {
          email: session.user?.email,
        },
      })
      .then((res) => res.data);

    const data = result.data as MyStat[];

    const liftByType: {
      type: string;
      lift: number;
    }[] = [];

    data.forEach((v) => {
      v.savedExercisesStatus.forEach((status) => {
        const lift = status.exerciseSetValues.reduce((acc, cur) => {
          return acc + (cur.repeat ?? 0) * (cur.weight ?? 0);
        }, 0);

        const foundType = liftByType.find((v) => v.type === status.type);
        if (foundType) {
          foundType.lift = foundType.lift + lift;
        } else {
          liftByType.push({
            type: status.type,
            lift: lift,
          });
        }
      });
    });

    const totalWorkout = data.length;

    return {
      liftByType: liftByType,
      totalWorkout: totalWorkout,
    } as TotalWorkoutSummary;
  } catch (error) {
    console.log("fetch failed", error);
    return null;
  }
}

export { getData as getTotalSummary };
