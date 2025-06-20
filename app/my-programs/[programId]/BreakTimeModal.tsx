import Image from "next/image";
import { useEffect, useState } from "react";
import {
  MODAL_VISIBLE_DELAY,
  OVERLAY_OPEN_DELAY,
} from "@/app/component/ModalWrapper";
import { Button } from "@/app/component/Button";

type BreakTimeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TimerAnimationProps = {
  breakTime: number;
  onClose: () => void;
};

const TimerAnimation = ({ breakTime, onClose }: TimerAnimationProps) => {
  const [running, setRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(breakTime);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (timeLeft > 0) {
      if (running) {
        intervalId = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      } else {
        clearInterval(intervalId!);
      }
    } else if (timeLeft < 1) {
      setTimeout(() => {
        onClose();
      }, 1000);
    }

    return () => clearInterval(intervalId!);
  }, [timeLeft, breakTime, running, onClose]);

  useEffect(() => {
    setTimeLeft(breakTime);
  }, [breakTime]);

  const progress = (timeLeft / breakTime) * 100;

  return (
    <div className="flex gap-x-4 mt-4">
      <div className="flex flex-col items-center gap-y-4">
        <div className="relative rounded-3xl bg-gray2 p-3">
          <svg
            className="w-[240px] h-[240px] transform rotate-[-90deg]"
            viewBox="0 0 100 100"
          >
            <circle
              className="text-gray-400"
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
            />
            <circle
              className="text-yellow transition-[stroke-dashoffset] duration-1000 ease-linear"
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeDasharray="283"
              style={{ strokeDashoffset: 283 + (progress * 283) / 100 }}
            />
          </svg>
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-[140px] h-[140px] rounded-[140px] bg-gray1 flex justify-center items-center"
            onClick={() => {
              setRunning((prev) => !prev);
            }}
          >
            {running ? (
              <div className="relative w-8 h-8">
                <Image
                  className="object-contain cursor-pointer"
                  src="/pause.png"
                  alt="pause program"
                  fill
                  sizes="32px"
                />
              </div>
            ) : (
              <div className="relative w-8 h-8">
                <Image
                  className="object-contain cursor-pointer"
                  src="/resume.png"
                  alt="resume program"
                  fill
                  sizes="32px"
                />
              </div>
            )}
          </button>
        </div>
        <div className="flex flex-col w-full justify-center">
          <div className="text-3xl text-gray4">Timer</div>
          <div className="font-bold text-[100px] flex justify-center items-center tracking-[6px] -mt-[10px]">
            {`${Math.floor(timeLeft / 60)
              .toString()
              .padStart(2, "0")}:${(timeLeft % 60)
              .toString()
              .padStart(2, "0")}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BreakTimeModal = ({ isOpen, onClose }: BreakTimeModalProps) => {
  const [timerIndex, setTimerIndex] = useState(2);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
      setTimerIndex(1);
      const timer = setTimeout(() => setVisible(true), MODAL_VISIBLE_DELAY);
      return () => clearTimeout(timer);
    } else {
      const openTimer = setTimeout(() => {
        setOpen(false);
      }, OVERLAY_OPEN_DELAY);
      const timer = setTimeout(() => setVisible(false), MODAL_VISIBLE_DELAY);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const TimerButton = ({ text, index }: { text: string; index: number }) => {
    return (
      <button
        className={`rounded-2xl px-3 text-[24px] ${
          timerIndex === index ? "bg-gray2 text-yellow" : "bg-gray4 text-gray6"
        }`}
        onClick={() => setTimerIndex(index)}
      >
        {text}
      </button>
    );
  };

  const breakTime = timerIndex === 0 ? 90 : timerIndex === 1 ? 60 : 30;

  return (
    <div
      aria-label="break-time"
      className={`${
        open
          ? "flex fixed inset-0 items-center justify-center z-20 pr-4"
          : "hidden"
      } ${visible && "bg-black bg-opacity-50"} delay-${
        MODAL_VISIBLE_DELAY + 500
      }`}
    >
      <div
        className={`transition-all duration-500 left-1/2 sm:translate-x-[400px] ${
          visible ? "translate-y-0" : "-translate-y-full mb-[840px]"
        } w-[300px] h-fit rounded-3xl p-5 
          bg-gray1 flex flex-col items-center justify-between`}
      >
        <div className="flex gap-x-4">
          <TimerButton text="1m 30s" index={0} />
          <TimerButton text="1min" index={1} />
          <TimerButton text="30s" index={2} />
        </div>
        {open && <TimerAnimation breakTime={breakTime} onClose={onClose} />}
        <Button
          title="Stop"
          onClick={() => {
            onClose();
          }}
          className="bg-red/40 text-red text-10 w-full min-h-[80px] 
          hover:bg-red/40 hover:text-red"
        />
      </div>
    </div>
  );
};
