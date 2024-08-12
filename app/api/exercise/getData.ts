"use server";

import axios from "axios";

import { Exercise } from "../types";

async function getData(id: string) {
  try {
    const result = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/exercise`, {
        params: {
          exerciseId: id,
        },
      })
      .then((res) => res.data);

    return result.data as Exercise;
  } catch (error) {
    console.log("fetch failed", error);
    return null;
  }
}

export { getData as getExerciseData };
