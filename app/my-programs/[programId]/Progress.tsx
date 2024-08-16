"use client";

import { RegisteredProgram } from "@/app/api/types";
import { Button } from "@/app/component/Button";
import { useEffect, useState } from "react";

type ProgressProps = {
  data: RegisteredProgram | undefined;
};

export const Progress = ({ data }: ProgressProps) => {
  const [workouts, setWorkouts] = useState<RegisteredProgram>();

  useEffect(() => {
    if (!data) return;

    setWorkouts(data);
  }, [data]);

  return (
    <section>
      <div className="flex items-center gap-x-12">
        <h1 className="text-5xl">{workouts?.programName}</h1>
        <Button
          title="START"
          onClick={() => {}}
          className="border-2 px-10"
          fontSize={32}
        />
      </div>
    </section>
  );
};
