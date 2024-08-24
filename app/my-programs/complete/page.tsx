import { CompletePageWrapper } from "./CompletePageWrapper";
import { WorkoutSummary } from "./WorkoutSummary";

export default async function Page() {
  return (
    <div className="h-fit w-screen relative bg-black flex flex-col pt-[20px] pl-[80px] pr-[40px] gap-y-8">
      <CompletePageWrapper>
        <WorkoutSummary />
      </CompletePageWrapper>
    </div>
  );
}
