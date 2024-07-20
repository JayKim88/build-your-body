"use client";

import { useEffect, useState } from "react";

import { Exercise } from "../api/types";
import { Title } from "./Filter";

const Exercises = ({
  data,
  selectedType,
}: {
  data?: Exercise[];
  selectedType: Title;
}) => {
  const [exercisesData, setExercisesData] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!data?.length) return;

    const filteredData =
      selectedType === "All"
        ? data
        : data.filter(
            (v) => v.type.toLowerCase() === selectedType.toLocaleLowerCase()
          );

    setExercisesData(filteredData);
  }, [data, selectedType]);

  return (
    <section className="grid">
      {exercisesData.length ? (
        exercisesData.map(({ _id, thumbnail_img_url, name, summary }) => (
          <div key={_id}>
            <div>{thumbnail_img_url}</div>
            <div>{name}</div>
            <div>{summary}</div>
          </div>
        ))
      ) : (
        <></>
      )}
    </section>
  );
};

export { Exercises };
