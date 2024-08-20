"use client";

import { useProgressStore } from "@/app/store";
import { useRouter } from "next/navigation";

export const WorkoutSummary = () => {
  const router = useRouter();
  const completedAt = useProgressStore((state) => state.completedAt);
  const savedWorkoutTime = useProgressStore((state) => state.workoutTime);
  const resetProgramId = useProgressStore((state) => state.resetProgramId);
  const resetWorkoutTime = useProgressStore((state) => state.resetWorkoutTime);
  const resetExercisesStatus = useProgressStore(
    (state) => state.resetExercisesStatus
  );
  const resetCompletedAt = useProgressStore((state) => state.resetCompletedAt);

  const goToListWithoutSave = () => {
    router.replace("/my-programs");
    resetProgramId();
    resetWorkoutTime();
    resetExercisesStatus();
    resetCompletedAt();
  };

  if (!completedAt) return <>완료된 프로그램이 없습니다.</>;

  return (
    <div className="flex flex-col">
      <div>{completedAt && new Date(completedAt).toLocaleTimeString()}</div>
      <div>{savedWorkoutTime}</div>
      <div>
        <button
          onClick={() => {
            goToListWithoutSave();
          }}
        >
          Exit
        </button>
      </div>
    </div>
  );
};
