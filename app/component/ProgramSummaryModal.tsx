import { useState } from "react";

import { RegisteredProgram } from "../api/types";
import { ExerciseSummaryCard } from "./ExerciseSummaryCard";
import { ModalWrapper } from "./ModalWrapper";
import { ExerciseDetailModal } from "./ExerciseDetailModal";

type ProgramSummaryModalProps = {
  isOpen: boolean;
  data?: RegisteredProgram;
  onClose: () => void;
};

export const ProgramSummaryModal = ({
  isOpen,
  onClose,
  data,
}: ProgramSummaryModalProps) => {
  const [clickedExerciseId, setClickedExerciseId] = useState<string>();

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        Title={<h1 className="text-4xl">{data?.programName}</h1>}
        customClassName="w-fit overflow-auto"
      >
        <main className="flex gap-x-6 overflow-x-auto">
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
