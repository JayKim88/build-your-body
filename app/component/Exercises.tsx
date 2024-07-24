"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Exercise } from "../api/types";
import { exerciseTypes, ExerciseType } from "./Filter";
import { ExerciseDetailModal } from "./ExerciseDetailModal";

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

const ExerciseCard = (
  props: Exercise & {
    onClick: (v: string) => void;
  }
) => {
  const { _id, type, thumbnail_img_url, name, summary, onClick, ...rest } =
    props;

  const bgColor = exerciseTypes.find(
    (v) => v.type.toLowerCase() === type.toLowerCase()
  )?.selectedColor;

  return (
    <div
      key={_id}
      className={`${bgColor} w-[384px] h-[590px] rounded-3xl p-5 gap-y-6 flex flex-col`}
      onClick={() => onClick(_id)}
    >
      <div className="relative w-full h-72 rounded-2xl overflow-hidden">
        <Image
          src={thumbnail_img_url}
          alt="name"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="text-[32px]">{name}</div>
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
  const [clickedExercise, setClickedExercise] = useState<Exercise>();
  const [isOpen, setIsOpen] = useState(false);

  const handleClickExercise = (id: string) => {
    const data = exercisesData.find((v) => v._id === id);
    setClickedExercise(data);
    setIsOpen(true);
  };

  const handleClearClickedExercise = () => {
    setIsOpen(false);
    setTimeout(() => setClickedExercise(undefined), 1000);
  };

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
    <>
      <section className="flex gap-6 flex-wrap">
        {exercisesData.length ? (
          exercisesData.map((data) => (
            <ExerciseCard
              key={data._id}
              {...data}
              onClick={handleClickExercise}
            />
          ))
        ) : (
          <></>
        )}
      </section>
      <ExerciseDetailModal
        isOpen={isOpen}
        data={clickedExercise}
        onClose={handleClearClickedExercise}
      />
    </>
  );
};

export { Exercises };
