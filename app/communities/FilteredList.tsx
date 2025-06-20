"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { MyStat as PerformedProgramsData } from "../api/types";
import { Filter, ExerciseType } from "../component/Filter";
import { PerformedPrograms } from "./PerformedPrograms";

type FilteredListProps = {
  data: PerformedProgramsData[];
  userId?: string;
};

const FilteredList = ({ data, userId }: FilteredListProps) => {
  const { data: session } = useSession();
  const [selectedType, setSelectedType] = useState<ExerciseType>("all");
  const [showMyData, setShowMyData] = useState(false);
  const [performedProgramsData, setPerformedProgramsData] = useState<
    PerformedProgramsData[]
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFilter = (v: ExerciseType) => setSelectedType(v);

  const isLoggedIn = !!session;

  useEffect(() => {
    if (!data?.length) return;

    const filteredData =
      selectedType === "all"
        ? data
        : data.filter((v) =>
            v.savedExercisesStatus.some(
              (status) => status.type === selectedType
            )
          );

    setPerformedProgramsData(
      filteredData.filter((v) =>
        showMyData ? v.userId === userId : v.userId !== userId
      )
    );
  }, [data, selectedType, showMyData, userId]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`flex flex-col gap-y-8 transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <Filter onFilter={handleFilter} selectedType={selectedType} />
      {isLoggedIn && (
        <div
          className={`${defaultRowStyles} fixed w-fit 
            top-[190px] z-10 right-[50px] items-end`}
        >
          <div className="text-4xl">Show my list</div>
          <label className="switch">
            <input
              type="checkbox"
              onChange={(e) => setShowMyData(e.target.checked)}
              checked={showMyData}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}
      <PerformedPrograms data={performedProgramsData} userId={userId} />
    </div>
  );
};

export { FilteredList };

const defaultRowStyles = "flex gap-x-[50px] text-[40px] justify-between";
