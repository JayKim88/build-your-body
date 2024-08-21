"use client";

import { useProgressStore } from "@/app/store";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import Terrible from "@/public/workout-complete-icon/terrible.svg";
import NotSatisfied from "@/public/workout-complete-icon/not-satisfied.svg";
import Soso from "@/public/workout-complete-icon/soso.svg";
import Happy from "@/public/workout-complete-icon/happy.svg";
import Lol from "@/public/workout-complete-icon/lol.svg";

type SatisfiedStatus = "terrible" | "notSatisfied" | "soso" | "happy" | "lol";

const formattedDuration = (value: number) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  return `${hours ? `${hours} h ` : ""}${
    minutes ? `${minutes} m ` : ""
  }${seconds} s`;
};

const PngIcon = ({ name }: { name: string }) => {
  return (
    <div className="relative w-12 h-12">
      <Image
        className="object-contain"
        src={`/workout-complete-icon/${name}.png`}
        alt={name}
        fill
      />
    </div>
  );
};

const SatisfiedStatusList = ({
  status,
  onSetStatus,
}: {
  status: SatisfiedStatus;
  onSetStatus: (v: SatisfiedStatus) => void;
}) => {
  return (
    <span className="flex items-center gap-x-4 [&>svg]:cursor-pointer">
      <Terrible
        className={`${status === "terrible" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => {
          onSetStatus("terrible");
        }}
      />
      <NotSatisfied
        className={`${
          status === "notSatisfied" ? "fill-yellow" : "fill-gray6"
        }`}
        onClick={() => {
          onSetStatus("notSatisfied");
        }}
      />
      <Soso
        className={`${status === "soso" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => {
          onSetStatus("soso");
        }}
      />
      <Happy
        className={`${status === "happy" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => {
          onSetStatus("happy");
        }}
      />
      <Lol
        className={`${status === "lol" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => {
          onSetStatus("lol");
        }}
      />
    </span>
  );
};

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

  const [satisfiedStatus, setSatisfiedStatus] =
    useState<SatisfiedStatus>("soso");

  const goToListWithoutSave = () => {
    router.replace("/my-programs");
    resetProgramId();
    resetWorkoutTime();
    resetExercisesStatus();
    resetCompletedAt();
  };

  if (!completedAt) return <>완료된 프로그램이 없습니다.</>;

  return (
    <div className="flex flex-col text-gray6 gap-y-20">
      <h1 className="text-[80px]">WORKOUT COMPLETE!</h1>
      <div className="flex gap-x-[280px]">
        <section className="flex flex-col gap-y-[100px]">
          <section className="flex flex-col gap-y-10">
            <div className="flex gap-x-[50px] text-[40px]">
              <span>START</span>
              <div className="flex gap-x-8">
                <span className="flex gap-x-2 items-center">
                  <PngIcon name="calendar" />
                  {completedAt && format(completedAt, "yyyy/MM/dd")}
                </span>
                <span className="flex gap-x-2 items-center">
                  <PngIcon name="time" />
                  {completedAt && format(completedAt, "HH:mm")}
                </span>
              </div>
            </div>
            <div className="flex gap-x-[50px] text-[40px]">
              <span>TOTAL</span>
              <span className="flex gap-x-2 items-center">
                <PngIcon name="duration" />
                {formattedDuration(savedWorkoutTime)}
              </span>
            </div>
          </section>
          <section>
            <div className="flex gap-x-[50px] text-[40px]">
              <span className="w-[200px]">Satisfaction</span>
              <SatisfiedStatusList
                status={satisfiedStatus}
                onSetStatus={(v) => setSatisfiedStatus(v)}
              />
            </div>
          </section>
        </section>
        <section></section>
      </div>

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
