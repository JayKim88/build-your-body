import { getStats } from "../api/my-stats/getData";
import { getTotalSummary } from "../api/my-stats/getTotalSummary";
import { getPrograms } from "../api/programs/getData";
import { MyStat, RegisteredProgram, TotalWorkoutSummary } from "../api/types";
import { Header } from "../component/Header";
import { HistoryByDateSection } from "./HistoryByDateSection";
import { HistoryByWeekSection } from "./HistoryByWeekSection";
import { TotalSummarySection } from "./TotalSummarySection";

export default async function Page() {
  const totalSummary = (await getTotalSummary()) as TotalWorkoutSummary | null;
  const programs = (await getPrograms({
    includeDeleted: true,
  })) as RegisteredProgram[] | undefined;

  const todayWorkoutsData = (await getStats({
    targetDate: new Date(),
  })) as MyStat[];

  return (
    <div
      className="h-fit w-screen relative bg-black flex flex-col pt-[20px] 
    px-[80px] gap-y-8 max-w-[1800px]"
    >
      <Header />
      <main className="flex gap-x-5">
        <section className="flex flex-col gap-y-5">
          <TotalSummarySection data={totalSummary} />
          <HistoryByWeekSection data={programs} />
        </section>
        <HistoryByDateSection data={todayWorkoutsData} />
      </main>
    </div>
  );
}
