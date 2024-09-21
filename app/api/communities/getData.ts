"use server";

import { getServerSession } from "next-auth";
import axios from "axios";

import { authOptions } from "../auth/[...nextauth]/authOptions";
import { MyStat } from "../types";

async function getData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/communities`)
      .then((res) => res.data);

    const formattedData = (result.data as MyStat[])?.map(
      ({ _id, ...rest }) => ({
        ...rest,
        _id: _id.toString(),
      })
    );

    return formattedData;
  } catch (error) {
    console.log("fetch failed", error);
    return null;
  }
}

export { getData as getCommunitiesList };
