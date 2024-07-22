"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Exercise } from "../api/types";
import { exerciseTypes, ExerciseType } from "./Filter";

type ExercisesProps = {
  data?: Exercise[];
  selectedType: ExerciseType;
};

type ExerciseCardProps = {
  id: string;
  img: string;
  title: string;
  summary: string;
  type: ExerciseType;
};

type CartIconProps = {
  title: string;
  src?: string;
  onSelect: (v: string) => void;
};

const CartIcon = ({ src, onSelect, title }: CartIconProps) => {
  return (
    <button onClick={() => {}} className="flex items-center justify-center">
      {src && <Image src={src} width={56} height={56} alt={title} />}
    </button>
  );
};

const ExerciseCard = ({ id, img, title, summary, type }: ExerciseCardProps) => {
  const bgColor = exerciseTypes.find(
    (v) => v.type.toLowerCase() === type.toLowerCase()
  )?.selectedColor;

  return (
    <div
      key={id}
      className={`${bgColor} w-[384px] h-[590px] rounded-3xl p-5 gap-y-6 flex flex-col`}
    >
      <div className="relative w-full h-72 rounded-2xl overflow-hidden">
        <Image src={img} alt="name" layout="fill" objectFit="cover" />
      </div>
      <div className="text-[32px]">{title}</div>
      <div className="text-lg min-h-[84px] text-black">{summary}</div>
      <div className="flex w-full justify-evenly">
        <CartIcon
          title="add"
          onSelect={() => {}}
          src="/cart-icon/add-to-cart.svg"
        />
        <CartIcon
          title="remove"
          onSelect={() => {}}
          src="/cart-icon/remove-from-cart.svg"
        />
      </div>
    </div>
  );
};

const Exercises = ({ data, selectedType }: ExercisesProps) => {
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
    <section className="flex gap-6 flex-wrap">
      {exercisesData.length ? (
        exercisesData.map(({ _id, thumbnail_img_url, name, summary, type }) => (
          <ExerciseCard
            key={_id}
            id={_id}
            img={thumbnail_img_url}
            title={name}
            summary={summary}
            type={type}
          />
        ))
      ) : (
        <></>
      )}
    </section>
  );
};

export { Exercises };
