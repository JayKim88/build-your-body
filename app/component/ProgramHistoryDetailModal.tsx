import { useMemo, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";

import { MyStat } from "../api/types";
import { ModalWrapper } from "./ModalWrapper";
import { ExerciseDetailModal } from "./ExerciseDetailModal";
import { ProgramHistoryDetailCard } from "./ProgramHistoryDetailCard";
import { capitalizeFirstLetter } from "../utils";
import Public from "@/public/public.svg";
import Private from "@/public/private.svg";
import { SatisfictionIcon } from "./SatisfactionIcon";

type ProgramHistoryDetailModalProps = {
  isOpen: boolean;
  data: MyStat | null;
  onClose: () => void;
  isCommunitiesPage?: boolean;
};

export const ProgramHistoryDetailModal = ({
  isOpen,
  onClose,
  data,
  isCommunitiesPage,
}: ProgramHistoryDetailModalProps) => {
  const [clickedExerciseId, setClickedExerciseId] = useState<string>();

  const cardsSectionWidth = useMemo(() => {
    return `max-w-[${
      (data?.savedExercisesStatus.length ?? 0) * (CARD_WIDTH + CARD_X_GAP) -
      CARD_X_GAP
    }px]`;
  }, [data?.savedExercisesStatus]);

  const isPublic = !!data?.isPublic;

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        Title={
          <div className="text-4xl flex justify-between items-center leading-none gap-x-2 w-full pr-1">
            <div className="flex gap-x-2">
              <span>
                {data?.completedAt ? format(data?.completedAt, "MM/dd") : ""}
              </span>
              <span>{data?.savedProgramName}</span>
            </div>
            {!isCommunitiesPage && (
              <div className="flex gap-x-2 items-center">
                {isPublic ? (
                  <Public className="fill-lightGreen" />
                ) : (
                  <Private className="stroke-lightRed [&>circle]:fill-lightRed" />
                )}
                <span
                  className={`${
                    isPublic ? "text-lightGreen" : "text-lightRed"
                  } pt-[2px]`}
                >
                  {isPublic ? "Public" : "Private"}
                </span>
              </div>
            )}
          </div>
        }
        customClassName="w-fit overflow-auto"
      >
        <main className="flex gap-x-6 gap-y-6 flex-col">
          <section className={`flex gap-x-6 ${cardsSectionWidth}`}>
            <div className="flex flex-col items-start justify-start gap-y-6 flex-1">
              <div className="flex items-center">
                <h1 className="text-[32px]">
                  {capitalizeFirstLetter(data?.title ?? "")}
                </h1>
                <SatisfictionIcon status={data?.satisfiedStatus} />
              </div>
              <div className="text-2xl">{data?.note ?? ""}</div>
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
