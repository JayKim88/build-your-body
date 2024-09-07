import { useState } from "react";
import { RegisteredProgram } from "../api/types";
import { ExerciseSummaryCard } from "./ExerciseSummaryCard";
import { ModalWrapper } from "./ModalWrapper";
import { ExerciseDetailModal } from "./ExerciseDetailModal";

type ExerciseSummaryModalProps = {
  isOpen: boolean;
  data?: RegisteredProgram;
  onClose: () => void;
};

export const ExerciseSummaryModal = ({
  isOpen,
  onClose,
  data,
}: ExerciseSummaryModalProps) => {
  const [clickedExerciseId, setClickedExerciseId] = useState<string>();

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        Title={<h1 className="text-4xl">{data?.programName}</h1>}
        customClassName="w-fit"
      >
        <main className="flex gap-x-6">
          {data?.exercises?.map((exercise) => (
            <ExerciseSummaryCard
              key={exercise.id}
              data={exercise}
              onClick={(v) => setClickedExerciseId(v)}
            />
          ))}
        </main>
      </ModalWrapper>
      <ExerciseDetailModal
        isOpen={!!clickedExerciseId}
        onClose={() => setClickedExerciseId(undefined)}
        exerciseId={clickedExerciseId}
      />
    </>
  );
};
