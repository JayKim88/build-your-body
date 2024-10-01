"use client";

import Image from "next/image";
import { capitalizeFirstLetter } from "../utils";

export type ExerciseType =
  | "all"
  | "chest"
  | "back"
  | "leg"
  | "shoulder"
  | "arm";

type ChipProps = {
  type: ExerciseType;
  src?: string;
  selectedBgColor: string;
  onSelect: (v: ExerciseType) => void;
  selected?: ExerciseType;
};

export const exerciseTypes: Omit<ChipProps, "onSelect" | "selected">[] = [
  {
    type: "all",
    selectedBgColor: "bg-orange",
  },
  {
    type: "chest",
    src: "/filter-icon/chest.png",
    selectedBgColor: "bg-lightRed",
  },
  {
    type: "back",
    src: "/filter-icon/back.png",
    selectedBgColor: "bg-yellow",
  },
  {
    type: "leg",
    src: "/filter-icon/leg.png",
    selectedBgColor: "bg-blue",
  },
  {
    type: "shoulder",
    src: "/filter-icon/shoulder.png",
    selectedBgColor: "bg-green",
  },
  {
    type: "arm",
    src: "/filter-icon/arm.png",
    selectedBgColor: "bg-purple",
  },
];

const Chip = ({
  type,
  src,
  selectedBgColor,
  onSelect,
  selected,
}: ChipProps) => {
  const isSelected = selected === type;

  return (
    <button
      onClick={() => {
        onSelect(type);
      }}
      className={`${isSelected ? selectedBgColor : "bg-gray2"}
       h-fit flex items-center justify-center gap-2 rounded-[32px] 
       py-2 px-4 text-[20px] transition-all ease-in-out duration-300
       ${isSelected ? "" : "hover:bg-gray6 hover:text-black"}  
      `}
    >
      {src && <Image src={src} width={24} height={24} alt={type} />}
      <span>{capitalizeFirstLetter(type)}</span>
    </button>
  );
};

export const Filter = ({
  onFilter,
  selectedType,
}: {
  onFilter: (v: ExerciseType) => void;
  selectedType: ExerciseType;
}) => (
  <section
    className="w-[1100px] flex overflow-auto gap-4 bg-black fixed h-[120px] 
  top-[130px] z-10 w-[calc(100vw-110px)] items-end pb-4"
  >
    {exerciseTypes.map((v) => (
      <Chip
        key={v.type}
        type={v.type}
        src={v.src}
        selectedBgColor={v.selectedBgColor}
        onSelect={onFilter}
        selected={selectedType}
      />
    ))}
  </section>
);
