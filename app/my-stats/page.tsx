import { getTotalSummary } from "../api/my-stats/getTotalSummary";
import { getPrograms } from "../api/programs/getData";
import { RegisteredProgram, TotalWorkoutSummary } from "../api/types";
import { Header } from "../component/Header";
import { StatSections } from "./Sections";

export default async function Page() {
  const [totalSummary, programs] = await Promise.all([
    getTotalSummary(),
    getPrograms({
      includeDeleted: true,
    }),
  ]);

  return (
    <div className="page-wrapper">
      <Header />
      <StatSections
        totalSummary={totalSummary as TotalWorkoutSummary}
        programs={programs as RegisteredProgram[]}
      />
    </div>
  );
}
