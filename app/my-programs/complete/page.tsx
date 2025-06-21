import { CompletePageWrapper } from "./CompletePageWrapper";
import { WorkoutSummary } from "./WorkoutSummary";

export default async function Page() {
  return (
    <div
      className="md:h-screen md:w-screen relative bg-black flex flex-col 
    md:pl-[80px] md:pr-[40px] gap-y-8 items-center max-w-full md:max-w-[1800px]"
    >
      <CompletePageWrapper>
        <WorkoutSummary />
      </CompletePageWrapper>
    </div>
  );
}
