import { startOfDay } from "date-fns";

import { getStats } from "../api/my-stats/getData";
import { getTotalSummary } from "../api/my-stats/getTotalSummary";
import { getPrograms } from "../api/programs/getData";
import { MyStat, RegisteredProgram, TotalWorkoutSummary } from "../api/types";
import { Header } from "../component/Header";
import { StatSections } from "./Sections";

export default async function Page() {
  const totalSummary = (await getTotalSummary()) as TotalWorkoutSummary;
  const programs = (await getPrograms({
    includeDeleted: true,
  })) as RegisteredProgram[];

  const todayWorkoutsData = (await getStats({
    targetDate: startOfDay(new Date()),
  })) as MyStat[];

  return (
    <div className="page-wrapper">
      <Header />
      <StatSections
        totalSummary={totalSummary}
        programs={programs}
        todayWorkoutsData={todayWorkoutsData}
      />
    </div>
  );
}
