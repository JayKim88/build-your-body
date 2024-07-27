"use server";

import { Exercise } from "../types";

async function getData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises`);

    if (!res.ok) {
      throw new Error("Failed to fetch exercises list");
    }

    const data = await res.json();

    return data as { data: Exercise[] };
  } catch (error) {
    console.log("fetch failed", error);

    return { data: [] };
  }
}

export { getData as getExercisesList };
