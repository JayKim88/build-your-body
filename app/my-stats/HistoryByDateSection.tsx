"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { isSameDay, setDate } from "date-fns";
import axios from "axios";
import "react-day-picker/style.css";

import { MyStat } from "../api/types";
import { TotalSummaryByDateSection } from "./TotalSummaryByDateSection";
import { ProgramsHistoryOnDateSection } from "./ProgramsHistoryOnDateSection";

type HistoryByDateSectionProps = {
  data: MyStat[];
};

export const HistoryByDateSection = (props: HistoryByDateSectionProps) => {
  const { data } = props ?? {};
  const now = useMemo(() => new Date(), []);
  const defaultClassNames = getDefaultClassNames();
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [totalLift, setTotalLift] = useState(0);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
  const [targetDateData, setTargetDateData] = useState<MyStat[] | null>(data);
  const [isInitialRendering, setIsInitialRendering] = useState(true);
  const [dataAvailableDates, setDataAvailableDates] = useState<string[]>();
  const [currentMonth, setCurrentMonth] = useState(setDate(now, 15));

  const getTargetDateData = useCallback(async () => {
    try {
      const result = (
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
            params: {
              email: session?.user?.email,
              targetDate: selectedDate,
            },
          })
          .then((res) => res.data)
      ).data as MyStat[];

      setTargetDateData(result);
    } catch (error) {
      return null;
    }
  }, [selectedDate, session?.user?.email]);

  const getTargetMonthDataAvailableDates = useCallback(async () => {
    try {
      const result = (
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
            params: {
              email: session?.user?.email,
              targetMonthDate: currentMonth,
            },
          })
          .then((res) => res.data)
      ).data as string[];

      setDataAvailableDates(result);
    } catch (error) {
      return null;
    }
  }, [currentMonth, session?.user?.email]);

  const handleSetTotalLift = useCallback(() => {
    let totalLift = 0;

    targetDateData?.forEach((v) => {
      v.savedExercisesStatus.forEach((status) => {
        const lift = status.exerciseSetValues.reduce((acc, cur) => {
          return acc + (cur.repeat ?? 0) * (cur.weight ?? 0);
        }, 0);

        totalLift += lift;
      });
    });

    setTotalLift(totalLift);
  }, [targetDateData]);

  const handleSetWorkoutTime = useCallback(() => {
    const totalWorkoutTime =
      targetDateData?.reduce((acc, cur) => acc + cur.savedWorkoutTime, 0) ?? 0;

    setTotalWorkoutTime(totalWorkoutTime);
  }, [targetDateData]);

  useEffect(() => {
    handleSetTotalLift();
    handleSetWorkoutTime();
  }, [targetDateData, handleSetTotalLift, handleSetWorkoutTime]);

  useEffect(() => {
    if (isSameDay(now, selectedDate) && isInitialRendering) return;

    getTargetDateData();
    setIsInitialRendering(false);
  }, [selectedDate, getTargetDateData, isInitialRendering, now]);

  useEffect(() => {
    if (!session?.user) return;

    getTargetMonthDataAvailableDates();
  }, [currentMonth, session?.user, getTargetMonthDataAvailableDates]);

  function hasDataForDate(date: Date) {
    return !!dataAvailableDates?.some((d) => isSameDay(d, date));
  }

  return (
    <section className="flex flex-col gap-y-5">
      <section className="flex flex-col gap-y-5">
        <div className="flex gap-x-5">
          <div className="w-[360px] h-[340px] rounded-3xl bg-gray0 relative">
            <DayPicker
              required={false}
              mode="single"
              selected={selectedDate}
              onSelect={(value) => value && setSelectedDate(value)}
              disabled={{ after: now }}
              modifiers={{
                hasData: (date: Date) => hasDataForDate(date),
              }}
              onMonthChange={(month) => setCurrentMonth(setDate(month, 15))}
              modifiersClassNames={{
                hasData: dataAvailableDotStyles,
              }}
              classNames={{
                today: `text-yellow`,
                selected: `bg-yellow rounded-full !text-black`,
                root: `${defaultClassNames.root} p-0 bg-gray0 scale-95 absolute -top-1 left-[22px] w-[322px]`,
                chevron: `${defaultClassNames.chevron} !fill-gray6`,
              }}
            />
          </div>
          <TotalSummaryByDateSection
            selectedDate={selectedDate}
            totalLift={totalLift}
            totalWorkoutTime={totalWorkoutTime}
          />
        </div>
        <ProgramsHistoryOnDateSection
          data={targetDateData}
          date={selectedDate}
        />
      </section>
    </section>
  );
};

const dataAvailableDotStyles =
  "relative [&::after]:content-['•'] [&::after]:absolute [&::after]:-bottom-[4px] [&::after]:left-[20px] text-[24px]";
