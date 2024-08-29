"use server";

import { getServerSession } from "next-auth";
import axios from "axios";

import { authOptions } from "../auth/[...nextauth]/authOptions";
import { MyStat } from "../types";

async function getData(id?: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
        params: {
          email: session.user?.email,
          id: id,
        },
      })
      .then((res) => res.data);

    let formattedData: MyStat | MyStat[];

    if (Array.isArray(result.data)) {
      formattedData = (result.data as MyStat[])?.map(
        ({ _id, userId, ...rest }) => ({
          ...rest,
          _id: _id.toString(),
          userId: userId.toString(),
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
