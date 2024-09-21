"use client";

import { useState } from "react";

import { MyStat as PerformedData } from "../api/types";
import { Filter, ExerciseType } from "../component/Filter";
import { PerformedPrograms } from "./PerformedPrograms";

type FilteredListProps = {
  data: PerformedData[];
  userId?: string;
};

const FilteredList = ({ data, userId }: FilteredListProps) => {
  const [selectedType, setSelectedType] = useState<ExerciseType>("all");

  const handleFilter = (v: ExerciseType) => setSelectedType(v);

  return (
    <div className="flex flex-col gap-y-8">
      <Filter onFilter={handleFilter} selectedType={selectedType} />
      <PerformedPrograms
        data={data}
        selectedType={selectedType}
        userId={userId}
      />
    </div>
  );
};

export { FilteredList };
