import { useState } from "react";
import { format } from "date-fns";

import { MyStat } from "../api/types";
import { ModalWrapper } from "./ModalWrapper";
import { ExerciseDetailModal } from "./ExerciseDetailModal";
import { ProgramHistoryDetailCard } from "./ProgramHistoryDetailCard";

type ProgramHistoryDetailModalProps = {
  isOpen: boolean;
  data: MyStat | null;
  onClose: () => void;
};

export const ProgramHistoryDetailModal = ({
  isOpen,
  onClose,
  data,
}: ProgramHistoryDetailModalProps) => {
  const [clickedExerciseId, setClickedExerciseId] = useState<string>();

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        Title={
          <h1 className="text-4xl flex justify-center items-center leading-none gap-x-2">
            <span>
              {data?.completedAt ? format(data?.completedAt, "MM/dd") : ""}
            </span>
            <span>{data?.savedProgramName}</span>
          </h1>
        }
        customClassName="w-fit overflow-auto"
      >
        <main className="flex gap-x-6">
          {data?.savedExercisesStatus?.map((status) => (
            <ProgramHistoryDetailCard
              key={status.id}
              data={status}
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
