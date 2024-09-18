import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";

import { MyStat } from "../api/types";
import { ModalWrapper } from "./ModalWrapper";
import { ExerciseDetailModal } from "./ExerciseDetailModal";
import { ProgramHistoryDetailCard } from "./ProgramHistoryDetailCard";
import { capitalizeFirstLetter } from "../utils";

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

  const cardsSectionWidth = `w-[${
    (data?.savedExercisesStatus.length ?? 0) * (CARD_WIDTH + CARD_X_GAP) -
    CARD_X_GAP
  }px]`;

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
        <main className="flex gap-x-6 gap-y-6 flex-col">
          <section className={`flex gap-x-6 ${cardsSectionWidth}`}>
            <div className="flex flex-col items-start justify-start gap-y-6 flex-1">
              <h1 className="text-[32px]">
                {capitalizeFirstLetter(data?.title ?? "")}
              </h1>
              <div>{data?.note ?? ""}</div>
            </div>
            {data?.imageUrl && (
              <div className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden">
                <Image
                  src={data?.imageUrl}
                  alt="name"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1200px) 100vw"
                  priority
                />
              </div>
            )}
          </section>
          <section className="flex gap-x-6">
            {data?.savedExercisesStatus?.map((status) => (
              <ProgramHistoryDetailCard
                key={status.id}
                data={status}
                onClick={(v) => setClickedExerciseId(v)}
              />
            ))}
          </section>
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

const CARD_WIDTH = 300;
const CARD_X_GAP = 24;
