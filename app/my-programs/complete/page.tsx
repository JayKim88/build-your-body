import { CompletePageWrapper } from "./CompletePageWrapper";
import { WorkoutSummary } from "./WorkoutSummary";

export default async function Page() {
  return (
    <div
      className="h-fit w-screen relative bg-black flex flex-col 
    pl-[80px] pr-[40px] gap-y-8 items-center max-w-[1800px]"
    >
      <CompletePageWrapper>
        <WorkoutSummary />
      </CompletePageWrapper>
    </div>
  );
}
