import { getTotalSummary } from "../api/my-stats/getTotalSummary";
import { TotalWorkoutSummary } from "../api/types";
import { Header } from "../component/Header";
import { TotalSummarySection } from "./TotalSummarySection";

export default async function Page() {
  const fetchedData = (await getTotalSummary()) as TotalWorkoutSummary | null;

  return (
    <div
      className="h-fit w-screen relative bg-black flex flex-col pt-[20px] 
    px-[80px] gap-y-8 max-w-[1800px]"
    >
      <Header />
      <TotalSummarySection data={fetchedData} />
    </div>
  );
}
