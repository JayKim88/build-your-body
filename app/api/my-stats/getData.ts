"use server";

import { getServerSession } from "next-auth";
import axios from "axios";

import { authOptions } from "../auth/[...nextauth]/authOptions";
import { HistoryChartData, MyStat } from "../types";

type getStatsProps = {
  workoutId?: string;
  programId?: string;
  targetDate?: Date;
  targetMonthDate?: Date;
  lastWorkout?: boolean;
};

async function getData(props: getStatsProps) {
  const { workoutId, programId, targetDate, lastWorkout } = props ?? {};

  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
        params: {
          email: session.user?.email,
          workoutId,
          programId,
          targetDate,
          lastWorkout,
        },
      })
      .then((res) => res.data);

    let formattedData: HistoryChartData | MyStat | MyStat[];

    if (Array.isArray(result.data)) {
      formattedData = (result.data as MyStat[])?.map(
        ({ _id, userId, ...rest }) => ({
          ...rest,
          _id: _id?.toString(),
          userId: userId?.toString(),
        })
      );
    } else {
      const { _id, userId, ...rest } = result.data ?? {};
      formattedData = {
        ...rest,
        _id: _id?.toString(),
        userId: userId?.toString(),
      };
    }

    return formattedData;
  } catch (error) {
    console.log("fetch failed", error);
    return null;
  }
}

export { getData as getStats };
