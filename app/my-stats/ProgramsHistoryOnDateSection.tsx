import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

import { MyStat } from "../api/types";
import { formattedTime } from "../utils";
import { PngIcon } from "../my-programs/complete/WorkoutSummary";
import { ProgramHistoryDetailModal } from "../component/ProgramHistoryDetailModal";

type ProgramsHistoryOnDateSectionProps = {
  data: MyStat[] | null;
  date: Date;
};

type ProgramsHistoryOnDateProps = {
  data: ProgramsHistoryOnDateSectionProps["data"];
  date: Date;
  selectedProgramId: string;
  onSelectProgramId: (v: string) => void;
};

type ProgramSummaryProps = {
  data: MyStat | null;
};

const ProgramsHistoryOnDate = ({
  data,
  date,
  selectedProgramId,
  onSelectProgramId,
}: ProgramsHistoryOnDateProps) => {
  const isDataAvailable = !!data?.length;

  return (
    <div className="w-[360px] h-[340px] flex flex-col gap-y-4 rounded-[32px] p-5 bg-gray0 relative">
      <div className="flex justify-start align-center gap-x-2">
        <PngIcon name="calendar" className="w-[40px] h-[40px]" />
        <h1 className="text-2xl flex justify-center items-center leading-none">
          {format(date, "MM/dd")}
        </h1>
      </div>
      {isDataAvailable ? (
        <ul className="flex flex-col gap-y-4 overflow-auto">
          {data?.map((v) => {
            const isSelected = v._id === selectedProgramId;
            const programName = v.savedProgramName;
            const completedAt = v.completedAt;
            const workoutTime = v.savedWorkoutTime;

            return (
              <li
                key={v._id}
                className={`m-1 min-h-[72px] rounded-3xl bg-gray1 flex justify-between px-4 py-2 cursor-pointer ${
                  isSelected ? "outline outline-2 outline-yellow" : ""
                }`}
                onClick={() => onSelectProgramId(v._id)}
              >
                <div className="text-[22px] flex items-center">
                  {programName}
                </div>
                <div className="flex flex-col justify-around">
                  {completedAt && (
                    <div className="flex gap-x-0.5 items-center">
                      <PngIcon name="time" className="w-5 h-5" />
                      <span className="leading-none">
                        {format(completedAt, "hh:mm a")}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-x-0.5 items-center">
                    <PngIcon name="duration" className="w-5 h-5" />
                    <span className="leading-none">
                      {formattedTime(workoutTime)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 text-2xl">
          No Data
        </div>
      )}
    </div>
  );
};

const ProgramHistorySummary = ({ data }: ProgramSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const formattedData = data?.savedExercisesStatus.map((v) => {
    const exerciseName = v.name;
    const lift = v.exerciseSetValues.reduce((acc, cur) => {
      return acc + (cur.repeat ?? 0) * (cur.weight ?? 0);
    }, 0);

    return {
      exerciseName,
      lift,
    };
  });

  const isDataAvailable = !!data;

  return (
    <>
      <div
        className={`w-[360px] h-[340px] flex flex-col gap-y-4 rounded-[32px] p-5 
          bg-gray0 relative ${isDataAvailable ? "cursor-pointer" : ""}`}
        {...(isDataAvailable && {
          onClick: () => {
            setIsOpen(true);
          },
        })}
      >
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-2xl">History on Date</h1>
          <span className="text-2xl">
            {data ? "- " + data?.savedProgramName : ""}
          </span>
        </div>
        {isDataAvailable ? (
          <ul className="flex flex-col gap-y-4 overflow-auto">
            {formattedData?.map((v) => {
              const exerciseName = v.exerciseName;
              const lift = v.lift;

              return (
                <li
                  key={v.exerciseName}
                  className="rounded-3xl bg-gray1 flex justify-between px-4 py-2 items-center"
                >
                  <div className="text-[18px] flex items-center h-fit">
                    {exerciseName}
                  </div>
                  <div className="flex items-end gap-x-1">
                    <span className="text-[14px]">total</span>
                    <span className="text-2xl leading-[26px]">
                      {lift.toLocaleString()}
                    </span>
                    <span className="text-[14px]">kg</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="absolute top-1/2 right-1/2 translate-x-1/2 text-2xl">
            No Data
          </div>
        )}
      </div>
      <ProgramHistoryDetailModal
        isOpen={isOpen}
        data={data}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const ProgramsHistoryOnDateSection = ({
  data,
  date,
}: ProgramsHistoryOnDateSectionProps) => {
  const [selectedProgramId, setSelectedWorkoutId] = useState("");

  const selectedProgram = useMemo(
    () => data?.find((v) => v._id === selectedProgramId) ?? null,
    [selectedProgramId]
  );

  useEffect(() => {
    if (data?.length) {
      setSelectedWorkoutId(data?.[0]?._id);

      return;
    }
    setSelectedWorkoutId("");
  }, [data]);

  return (
    <section className="flex gap-x-5">
      <ProgramsHistoryOnDate
        data={data}
        date={date}
        selectedProgramId={selectedProgramId}
        onSelectProgramId={(v) => setSelectedWorkoutId(v)}
      />
      <ProgramHistorySummary data={selectedProgram} />
    </section>
  );
};
