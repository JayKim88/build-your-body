"use server";

import { Exercise } from "../types";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises`);

  if (!res.ok) {
    throw new Error("Failed to fetch exercises list");
  }

  const data = await res.json();

  return data as { data: Exercise[] };
}

export { getData as getExercisesList };
