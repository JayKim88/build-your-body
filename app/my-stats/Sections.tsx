"use client";

import { useEffect, useState } from "react";

import { MyStat, RegisteredProgram, TotalWorkoutSummary } from "../api/types";
import { HistoryByDateSection } from "./HistoryByDateSection";
import { HistoryByWeekSection } from "./HistoryByWeekSection";
import { TotalSummarySection } from "./TotalSummarySection";

type StatSectionsProps = {
  totalSummary: TotalWorkoutSummary;
  programs: RegisteredProgram[];
  todayWorkoutsData: MyStat[];
};

export const StatSections = ({
  totalSummary,
  programs,
  todayWorkoutsData,
}: StatSectionsProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main
      className={`flex gap-x-5 gap-y-5 overflow-auto max-w-[calc(100vw-110px)]
    transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <section className="flex flex-col gap-y-5">
        <TotalSummarySection data={totalSummary} />
        <HistoryByWeekSection data={programs} />
      </section>
      <HistoryByDateSection data={todayWorkoutsData} />
    </main>
  );
};
