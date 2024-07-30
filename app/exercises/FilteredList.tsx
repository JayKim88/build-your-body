"use client";

import { useState } from "react";
import { Exercise } from "../api/types";
import { Filter, ExerciseType } from "../component/Filter";
import { Exercises } from "../component/Exercises";

const FilteredList = ({ data }: { data: Exercise[] }) => {
  const [selectedType, setSelectedType] = useState<ExerciseType>("All");

  const handleFilter = (v: ExerciseType) => setSelectedType(v);

  console.log("Now using demo data!");

  return (
    <div className="flex flex-col gap-y-8">
      <Filter onFilter={handleFilter} selectedType={selectedType} />
      <Exercises data={data} selectedType={selectedType} />
    </div>
  );
};

export { FilteredList };
