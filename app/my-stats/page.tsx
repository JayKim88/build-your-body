import { startOfDay } from "date-fns";

import { getStats } from "../api/my-stats/getData";
import { getTotalSummary } from "../api/my-stats/getTotalSummary";
import { getPrograms } from "../api/programs/getData";
import { MyStat, RegisteredProgram, TotalWorkoutSummary } from "../api/types";
import { Header } from "../component/Header";
import { StatSections } from "./Sections";

export default async function Page() {
  const [totalSummary, programs, todayWorkoutsData] = await Promise.all([
    getTotalSummary(),
    getPrograms({
      includeDeleted: true,
    }),
    getStats({
      targetDate: startOfDay(new Date()),
    }),
  ]);

  console.log("todayWorkoutsData", todayWorkoutsData);

  return (
    <div className="page-wrapper">
      <Header />
      <StatSections
        totalSummary={totalSummary as TotalWorkoutSummary}
        programs={programs as RegisteredProgram[]}
        todayWorkoutsData={todayWorkoutsData as MyStat[]}
      />
    </div>
  );
}
