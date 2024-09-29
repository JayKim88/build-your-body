import Image from "next/image";
import { memo, useCallback, useEffect, useState } from "react";

import { RegisteredProgram } from "@/app/api/types";
import { Button } from "@/app/component/Button";
import { useProgressStore } from "@/app/store";
import { formattedTime } from "@/app/utils";

type ProgressTimerButtonProps = {
  data?: RegisteredProgram;
  isRunning: boolean;
  onSetRunning: (isRunning: boolean) => void;
};

const ProgressTimerButton = ({
  data,
  isRunning,
  onSetRunning,
}: ProgressTimerButtonProps) => {
  const savedWorkoutTime = useProgressStore((state) => state.workoutTime);
  const saveWorkoutTime = useProgressStore((state) => state.saveWorkoutTime);
  const saveProgramInfo = useProgressStore((state) => state.saveProgramInfo);
  const [time, setTime] = useState(0); // Time in seconds

  const handleStart = useCallback(() => {
    if (!time) {
      saveProgramInfo({
        id: data?._id ?? "",
        name: data?.programName ?? "",
      });
    }
    onSetRunning(true);
  }, [data?._id, data?.programName, saveProgramInfo, time, onSetRunning]);

  const handlePause = () => {
    onSetRunning(false);
  };

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

  if (!data) return <></>;

  return time ? (
    <div className="rounded-3xl flex gap-x-4 items-center border-2 px-[20px] h-16">
      <div className="text-[32px] min-w-28">{formattedTime(time, true)}</div>
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
      className="border-2 px-[40px] h-16"
      fontSize={32}
    />
  );
};

export default memo(ProgressTimerButton);
