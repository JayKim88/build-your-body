"use client";

import { useEffect, useState } from "react";
import { RegisteredProgram } from "@/app/api/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/app/component/Button";
import { ConfirmModal } from "@/app/component/ConfirmModal";
import { CartProps, useProgressStore } from "@/app/store";
import { handleNumberKeyDown } from "@/app/utils";

type ProgressProps = {
  data: RegisteredProgram | undefined;
};

type ExerciseSetValues = {
  order: number;
  weight: number | undefined;
  repeat: number | undefined;
  checked: boolean;
};

type UpdateExerciseSetRowValues = {
  id?: string;
  order: number;
  title: string;
  value?: number | boolean;
};

const formattedTime = (time: number) => {
  const getSeconds = `0${time % 60}`.slice(-2);
  const minutes = `${Math.floor(time / 60)}`;
  const getMinutes = `0${parseInt(minutes) % 60}`.slice(-2);
  const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

  return `${getHours}:${getMinutes}:${getSeconds}`;
};

const ExerciseInput = ({
  title,
  value,
  onChange,
  isInProgess,
}: {
  title: string;
  value?: number;
  onChange: (title: string, value?: number) => void;
  isInProgess: boolean;
}) => {
  const isWeight = title === "Weight";

  return (
    <div className="flex relative items-center">
      <input
        className={`${
          isInProgess ? "border-2 border-yellow bg-gray2" : "bg-gray0"
        } w-[72px] h-[34px] rounded-lg outline-none text-2xl pl-2 pr-2 text-end mr-1`}
        value={value ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          const isEmpty = value === "";

          onChange(title, isEmpty ? undefined : Number(value));
        }}
        onKeyDown={(event) => handleNumberKeyDown(event, isWeight)}
        type="number"
        min={0}
        {...(!isWeight && {
          step: 1,
        })}
      />
      <span className="mt-1">{isWeight ? "kg" : "times"}</span>
    </div>
  );
};

const ExerciseSetRow = ({
  order,
  repeat,
  weight,
  onUpdateExerciseSetRow,
  exerciseSetValues,
  checked,
}: ExerciseSetValues & {
  onUpdateExerciseSetRow: (v: UpdateExerciseSetRowValues) => void;
  exerciseSetValues: ExerciseSetValues[];
}) => {
  const updateExerciseSetValue = (title: string, value?: number | boolean) => {
    onUpdateExerciseSetRow({
      order,
      title,
      value,
    });
  };

  const isInProgess =
    (order === 1 && !checked) ||
    (exerciseSetValues[order - 2]?.checked && !checked);
  const isNextSet = !isInProgess && !checked;

  const checkboxBorderColor = isInProgess
    ? "border-yellow"
    : isNextSet
    ? "border-transparent"
    : "border-gray6";

  const progressStyles = isInProgess
    ? "border-2 border-yellow bg-gray2"
    : "pointer-events-none bg-gray0";

  return (
    <div
      className={`flex justify-around items-center rounded-[32px] h-[50px] px-1 ${progressStyles}`}
    >
      <span className="w-fit">{order} set</span>
      <ExerciseInput
        title="Weight"
        onChange={updateExerciseSetValue}
        value={weight}
        isInProgess={isInProgess}
      />
      <ExerciseInput
        title="Repeat"
        onChange={updateExerciseSetValue}
        value={repeat}
        isInProgess={isInProgess}
      />
      <input
        type="checkbox"
        className={`exercise-checkbox appearance-none outline-none w-8 h-8 border-2 rounded-lg text-gray6 cursor-pointer ${checkboxBorderColor} ${
          (!repeat || !weight) && "pointer-events-none"
        }`}
        onChange={(e) => {
          updateExerciseSetValue("checked", e.target.checked);
        }}
      />
    </div>
  );
};

const ExerciseProgressCard = ({
  data,
  onUpdate,
  isRunning,
}: {
  data: ExercisesStatus[0];
  onUpdate: (v: UpdateExerciseSetRowValues) => void;
  isRunning: boolean;
}) => {
  const updateExerciseSetRow = (v: UpdateExerciseSetRowValues) => onUpdate(v);

  const isCompleted = data.isCompleted;

  return (
    <div className="relative">
      {isCompleted && (
        <div className="absolute top-1/2 -mt-4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-100 text-realGreen text-[60px] rotate-[-20deg]">
          Completed
        </div>
      )}
      <div
        className={`w-[400px] min-w-[400px] h-fit rounded-[32px] border-2 p-5 bg-gray1 flex flex-col gap-y-5 ${
          (!isRunning || isCompleted) && "pointer-events-none opacity-25"
        }`}
      >
        <h1 className="text-[32px] font-medium">{data.name}</h1>
        <div className="relative w-full h-[360px] rounded-2xl overflow-hidden">
          <Image
            src={data.img_url}
            alt="name"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 1200px) 100vw"
            priority
          />
        </div>
        <div className="flex flex-col gap-y-2">
          {data.exerciseSetValues.map((v) => (
            <ExerciseSetRow
              key={v.order}
              {...v}
              exerciseSetValues={data.exerciseSetValues}
              onUpdateExerciseSetRow={(v) =>
                updateExerciseSetRow({
                  ...v,
                  id: data.id,
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type ExercisesStatus = (CartProps & {
  exerciseSetValues: ExerciseSetValues[];
  isCompleted?: boolean;
})[];

export const Progress = ({ data }: ProgressProps) => {
  const router = useRouter();
  const savedWorkoutTime = useProgressStore((state) => state.workoutTime);
  const saveWorkoutTime = useProgressStore((state) => state.saveWorkoutTime);
  const resetWorkoutTime = useProgressStore((state) => state.resetWorkoutTime);
  const saveProgramId = useProgressStore((state) => state.saveProgramId);
  const resetProgramId = useProgressStore((state) => state.resetProgramId);

  const [exercisesStatus, setExercisesStatus] = useState<ExercisesStatus>();
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleStart = () => {
    !time && saveProgramId(data?._id ?? "");
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleUpdateProgressStatus = (
    newStatus: UpdateExerciseSetRowValues
  ) => {
    setExercisesStatus((prev) => {
      const lastExercisesStatus = prev;

      const newExercisesStatus = lastExercisesStatus?.map((prevStatus) => {
        if (prevStatus.id === newStatus.id) {
          const newExerciseSetValues = prevStatus.exerciseSetValues.map((v) => {
            if (v.order === newStatus.order) {
              return {
                ...v,
                [newStatus.title.toLocaleLowerCase()]: newStatus.value,
              };
            }
            return v;
          });

          const isAllChecked = newExerciseSetValues.every((v) => v.checked);

          return {
            ...prevStatus,
            exerciseSetValues: newExerciseSetValues,
            isCompleted: isAllChecked,
          };
        }
        return prevStatus;
      });

      return newExercisesStatus;
    });
  };

  useEffect(() => {
    if (!data) return;

    const formattedExercises = data.exercises.map((v) => {
      const exerciseSetValues = [];

      const setCount = v.set ?? 0;

      for (let i = 0; i < setCount; i++) {
        exerciseSetValues.push({
          order: i + 1,
          weight: v.weight,
          repeat: v.repeat,
          checked: false,
        });
      }

      return {
        ...v,
        exerciseSetValues,
      };
    });

    setExercisesStatus(formattedExercises);
  }, [data]);

  useEffect(() => {
    setTime(savedWorkoutTime);
  }, [savedWorkoutTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          saveWorkoutTime(prev + 1);
          return prev + 1;
        });
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval!);
    }

    return () => {
      clearInterval(interval!);
    };
    // eslint-disable-next-line
  }, [isRunning]);

  return (
    <section className="flex flex-col gap-y-[100px]">
      <div className="flex justify-between h-16">
        <div className="flex items-center gap-x-12">
          <h1 className="text-5xl">{data?.programName}</h1>
          {time ? (
            <div className="rounded-3xl flex gap-x-4 items-center border-2 px-[20px] h-16">
              <div className="text-[32px] min-w-28">{formattedTime(time)}</div>
              {isRunning ? (
                <div className="relative w-8 h-8">
                  <Image
                    className="object-contain cursor-pointer"
                    src="/pause.png"
                    alt="pause program"
                    fill
                    onClick={handlePause}
                  />
                </div>
              ) : (
                <div className="relative w-8 h-8">
                  <Image
                    className="object-contain cursor-pointer"
                    src="/resume.png"
                    alt="resume program"
                    fill
                    onClick={handleStart}
                  />
                </div>
              )}
            </div>
          ) : (
            <Button
              title="START"
              onClick={() => {
                handleStart();
              }}
              className="border-2 px-[40px]"
              fontSize={32}
            />
          )}
        </div>
        <Button
          title="TERMINATE"
          onClick={() => {
            setIsRunning(false);
            setOpenConfirm(true);
          }}
          fontSize={32}
          className="text-red bg-red/50 hover:text-red hover:bg-red/50 px-[40px] h-16"
        />
      </div>
      <div className="flex gap-x-10">
        {exercisesStatus?.map((exerciseStatus) => (
          <ExerciseProgressCard
            key={exerciseStatus.id}
            data={exerciseStatus}
            onUpdate={(values) => handleUpdateProgressStatus(values)}
            isRunning={isRunning}
          />
        ))}
      </div>
      <ConfirmModal
        isOpen={!!openConfirm}
        onClick={(v) => {
          if (v) {
            router.replace("/my-programs");
            resetProgramId();
            resetWorkoutTime();

            return;
          }
          setOpenConfirm(false);
        }}
        content="운동을 종료하시겠어요?"
      />
    </section>
  );
};
