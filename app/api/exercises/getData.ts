"use server";

import axios from "axios";
import { Exercise } from "../types";

async function getData() {
  try {
    const data = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises`)
      .then((res) => res.data);

    return data as { data: Exercise[] };
  } catch (error) {
    console.log("fetch failed", error);

    return { data: [] };
  }
}

export { getData as getExercisesList };
