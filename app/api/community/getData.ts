"use server";

import axios from "axios";

import { MyStat } from "../types";

async function getData() {
  try {
    const result = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
        params: {
          isPublic: true,
        },
      })
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
