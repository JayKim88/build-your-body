"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RegisteredProgram } from "@/app/api/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

import { Button } from "@/app/component/Button";
import { ConfirmModal } from "@/app/component/ConfirmModal";
import { CartProps, useProgressStore } from "@/app/store";
import { handleNumberKeyDown } from "@/app/utils";
import ProgressTimerButton from "./ProgressTimer";

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

type ExerciseProgressCardProps = {
  data: ExercisesStatus[0];
  index: number;
  isRunning: boolean;
  isInprogress: boolean;
  isLastExercise: boolean;
  onUpdate: (v: UpdateExerciseSetRowValues) => void;
  onAddDeleteSet: (id: string, isAdd: boolean) => void;
  onProceedToNextExercise: (index: number, id: string) => void;
};

export type ExercisesStatus = (CartProps & {
  exerciseSetValues: ExerciseSetValues[];
  isCompleted?: boolean;
})[];

type ExerciseInputProps = {
  title: string;
  value?: number;
  onChange: (title: string, value?: number) => void;
  isInProgess: boolean;
};

const ExerciseInput = ({
  title,
  value,
  onChange,
  isInProgess,
}: ExerciseInputProps) => {
  const isWeight = title === "Weight";

  return (
    <div className="flex relative items-center">
      <input
        className={`exercise-input ${
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
  isInprogress,
}: ExerciseSetValues & {
  onUpdateExerciseSetRow: (v: UpdateExerciseSetRowValues) => void;
  exerciseSetValues: ExerciseSetValues[];
  isInprogress: boolean;
}) => {
  const updateExerciseSetValue = (title: string, value?: number | boolean) => {
    onUpdateExerciseSetRow({
      order,
      title,
      value,
    });
  };

  const isFirstSetAndUnchecked = order === 1 && !checked;
  const isPrevCheckedAndThisUnchecked =
    exerciseSetValues[order - 2]?.checked && !checked;

  const isInProgessSet =
    isInprogress && (isFirstSetAndUnchecked || isPrevCheckedAndThisUnchecked);
  const isNextSet = !isInProgessSet && !checked;

  const checkboxBorderColor = isInProgessSet
    ? "border-yellow"
    : isNextSet
    ? "border-transparent"
    : "border-gray6";
  const progressStyles = isInProgessSet
    ? "border-2 border-yellow bg-gray2"
    : "pointer-events-none bg-gray0";
  const valuesRequiredStyles = !repeat || !weight ? "pointer-events-none" : "";
  const checkedStyles = checked
    ? "after:content-['✔'] text-[24px] flex items-center justify-center h-6"
    : "";

  return (
    <div
      className={`flex justify-around items-center rounded-[32px] h-[50px] px-1 ${progressStyles}`}
    >
      <span className="w-fit">{order} set</span>
      <ExerciseInput
        title="Weight"
        onChange={updateExerciseSetValue}
        value={weight}
        isInProgess={isInProgessSet}
      />
      <ExerciseInput
        title="Repeat"
        onChange={updateExerciseSetValue}
        value={repeat}
        isInProgess={isInProgessSet}
      />
      <input
        type="checkbox"
        className={`appearance-none outline-none w-8 h-8 border-2 rounded-lg text-gray6 cursor-pointer 
          ${checkboxBorderColor} ${valuesRequiredStyles} ${checkedStyles}         
        `}
        onChange={(e) => {
          updateExerciseSetValue("checked", e.target.checked);
        }}
      />
    </div>
  );
};

const ExerciseProgressCard = ({
  data,
  index,
  onUpdate,
  isRunning,
  isInprogress,
  isLastExercise,
  onAddDeleteSet,
  onProceedToNextExercise,
}: ExerciseProgressCardProps) => {
  const updateExerciseSetRow = (v: UpdateExerciseSetRowValues) => onUpdate(v);

  const isCompleted = data.isCompleted;
  const isUnclickable = !isRunning || !isInprogress;
  const isRestAllChecked =
    !!data.exerciseSetValues.length &&
    data.exerciseSetValues.every((v) => v.checked);
  const isNextButtonAvailable =
    isInprogress && !isCompleted && isRestAllChecked;

  return (
    <div className="relative">
      {isCompleted && (
        <div className="absolute top-1/2 -mt-4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-100 text-realGreen text-[60px] rotate-[-20deg]">
          Completed
        </div>
      )}
      <div
        className={`w-[400px] min-w-[400px] h-fit rounded-[32px] p-5 bg-gray1 flex flex-col gap-y-5 
          ${isUnclickable && "pointer-events-none opacity-25"}
        `}
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
              isInprogress={isInprogress}
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
        <div className="flex justify-between px-8">
          <button
            className="text-2xl text-realGreen"
            onClick={() => {
              onAddDeleteSet(data.id, true);
            }}
          >
            + Add Set
          </button>
          <button
            className="text-2xl text-red"
            onClick={() => {
              onAddDeleteSet(data.id, false);
            }}
          >
            - Remove Set
          </button>
        </div>
        <button
          className={`text-2xl ${
            isNextButtonAvailable ? "text-yellow" : "text-gray2"
          }`}
          onClick={() => {
            onProceedToNextExercise(index + 1, data.id);
          }}
          disabled={!isNextButtonAvailable}
        >
          {isLastExercise ? "Complete Program" : "➔ Next Exercise"}
        </button>
      </div>
    </div>
  );
};

export const Progress = ({ data }: ProgressProps) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const router = useRouter();
  const resetWorkoutTime = useProgressStore((state) => state.resetWorkoutTime);
  const resetProgramId = useProgressStore((state) => state.resetProgramId);
  const savedExercisesStatus = useProgressStore(
    (state) => state.savedExercisesStatus
  );
  const saveExercisesStatus = useProgressStore(
    (state) => state.saveExercisesStatus
  );
  const resetExercisesStatus = useProgressStore(
    (state) => state.resetExercisesStatus
  );

  const [exercisesStatus, setExercisesStatus] = useState<ExercisesStatus>();
  const [isRunning, setIsRunning] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const setRunning = (isRunning: boolean) => {
    setIsRunning(isRunning);
  };

  const updateProgressStatus = useCallback(
    (newStatus: UpdateExerciseSetRowValues) => {
      setExercisesStatus((prev) => {
        const lastExercisesStatus = prev;

        const newExercisesStatus = lastExercisesStatus?.map((prevStatus) => {
          if (prevStatus.id === newStatus.id) {
            const newExerciseSetValues = prevStatus.exerciseSetValues.map(
              (v) => {
                if (v.order === newStatus.order) {
                  return {
                    ...v,
                    [newStatus.title.toLocaleLowerCase()]: newStatus.value,
                  };
                }
                return v;
              }
            );

            const isAllChecked = newExerciseSetValues.every((v) => v.checked);

            return {
              ...prevStatus,
              exerciseSetValues: newExerciseSetValues,
              isCompleted: isAllChecked,
            };
          }
          return prevStatus;
        });

        newExercisesStatus && saveExercisesStatus(newExercisesStatus);

        return newExercisesStatus;
      });
    },
    [saveExercisesStatus]
  );

  const addDeleteExerciseSet = useCallback(
    (id: string, isAdd: boolean) => {
      setExercisesStatus((prev) => {
        const newExercisesStatus = prev?.map((v) => {
          if (v.id === id) {
            if (isAdd) {
              const initialSetValues = data?.exercises.find((v) => v.id === id);

              v.exerciseSetValues.push({
                order: v.exerciseSetValues.length + 1,
                weight: initialSetValues?.weight,
                repeat: initialSetValues?.repeat,
                checked: false,
              });

              return v;
            }
            v.exerciseSetValues.pop();

            return {
              ...v,
              isCompleted: false,
            };
          }
          return v;
        });

        newExercisesStatus && saveExercisesStatus(newExercisesStatus);

        return newExercisesStatus;
      });
    },
    [data?.exercises, saveExercisesStatus]
  );

  const proceedToNextExercise = (nextIndex: number, id: string) => {
    setExercisesStatus((prev) => {
      const lastStatus = prev;

      const newStatus = lastStatus?.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            isCompleted: true,
          };
        }
        return v;
      });

      newStatus && saveExercisesStatus(newStatus);

      return newStatus;
    });

    const isNextExerciseAvailable = !!exercisesStatus?.[nextIndex];
    isNextExerciseAvailable && swiperRef.current?.slideTo(nextIndex);
  };

  useEffect(() => {
    if (!data) return;

    if (savedExercisesStatus.length) {
      setExercisesStatus(savedExercisesStatus);
      return;
    }

    const formattedExercises = data.exercises.map((v) => {
      const exerciseSetValues = [] as ExerciseSetValues[];

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
  }, [data, savedExercisesStatus]);

  const nextProgressExerciseIndex = useMemo(
    () => exercisesStatus?.findIndex((v) => !v.isCompleted),
    [exercisesStatus]
  );

  useEffect(() => {
    const isOverZero =
      nextProgressExerciseIndex && nextProgressExerciseIndex > 0;

    if (!isOverZero) return;

    swiperRef.current?.slideTo(nextProgressExerciseIndex);
  }, [nextProgressExerciseIndex]);

  const MemoizedExerciseProgressCards = useMemo(() => {
    return (
      <div className="flex gap-x-10">
        <Swiper
          noSwipingClass="exercise-input"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
            scale: 0.7,
          }}
          modules={[EffectCoverflow, Pagination]}
          className="exercise-progress-cards-swiper"
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {exercisesStatus?.map((exerciseStatus, index) => {
            const isInprogressExercise = index === nextProgressExerciseIndex;
            const isLastExercise = index === exercisesStatus.length - 1;

            return (
              <SwiperSlide
                key={exerciseStatus.id}
                style={{
                  width: "fit-content",
                }}
              >
                <ExerciseProgressCard
                  key={exerciseStatus.id}
                  index={index}
                  data={exerciseStatus}
                  isRunning={isRunning}
                  isInprogress={isInprogressExercise}
                  isLastExercise={isLastExercise}
                  onUpdate={updateProgressStatus}
                  onAddDeleteSet={addDeleteExerciseSet}
                  onProceedToNextExercise={proceedToNextExercise}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }, [
    exercisesStatus,
    isRunning,
    updateProgressStatus,
    nextProgressExerciseIndex,
    addDeleteExerciseSet,
  ]);

  return (
    <section className="flex flex-col gap-y-[48px]">
      <div className="flex justify-between h-16">
        <div className="flex items-center gap-x-12">
          <h1 className="text-5xl">{data?.programName}</h1>
          <ProgressTimerButton
            data={data}
            isRunning={isRunning}
            onSetRunning={setRunning}
          />
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
      {MemoizedExerciseProgressCards}
      <ConfirmModal
        isOpen={!!openConfirm}
        onClick={(v) => {
          if (v) {
            router.replace("/my-programs");
            resetProgramId();
            resetWorkoutTime();
            resetExercisesStatus();

            return;
          }
          setOpenConfirm(false);
        }}
        content="운동을 종료하시겠어요?"
      />
    </section>
  );
};
