"use client";

import { useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";

import { Exercise } from "../api/types";
import { Filter, ExerciseType } from "../component/Filter";
import { Exercises } from "./Exercises";

const FilteredList = ({ data }: { data: Exercise[] }) => {
  const [selectedType, setSelectedType] = useState<ExerciseType>("all");
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFilter = (v: ExerciseType) => setSelectedType(v);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`flex flex-col gap-y-8 transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <SnackbarProvider>
        <Filter onFilter={handleFilter} selectedType={selectedType} />
        <Exercises data={data} selectedType={selectedType} />
      </SnackbarProvider>
    </div>
  );
};

export { FilteredList };
