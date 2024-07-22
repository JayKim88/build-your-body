"use client";

import Image from "next/image";

export type ExerciseType =
  | "All"
  | "Chest"
  | "Back"
  | "Leg"
  | "Shoulder"
  | "Arm";

type ChipProps = {
  type: ExerciseType;
  src?: string;
  selectedColor: string;
  onSelect: (v: ExerciseType) => void;
  selected?: ExerciseType;
};

export const exerciseTypes: Omit<ChipProps, "onSelect" | "selected">[] = [
  {
    type: "All",
    selectedColor: "bg-orange",
  },
  {
    type: "Chest",
    src: "/filter-icon/chest.png",
    selectedColor: "bg-lightRed",
  },
  {
    type: "Back",
    src: "/filter-icon/back.png",
    selectedColor: "bg-yellow",
  },
  {
    type: "Leg",
    src: "/filter-icon/leg.png",
    selectedColor: "bg-blue",
  },

  {
    type: "Shoulder",
    src: "/filter-icon/shoulder.png",
    selectedColor: "bg-green",
  },
  {
    type: "Arm",
    src: "/filter-icon/arm.png",
    selectedColor: "bg-purple",
  },
];

const Chip = ({ type, src, selectedColor, onSelect, selected }: ChipProps) => {
  const isSelected = selected === type;

  return (
    <button
      onClick={() => {
        onSelect(type);
      }}
      className={`${isSelected ? selectedColor : "bg-gray2"}
       flex items-center justify-center gap-2 rounded-[32px] py-2 px-4 text-[20px] ${
         isSelected ? "" : "hover:bg-gray6 hover:text-black"
       }  
      `}
    >
      {src && <Image src={src} width={24} height={24} alt={type} />}
      <span>{type}</span>
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
  <section className="w-[1100px] flex overflow-auto gap-4 mt-8">
    {exerciseTypes.map((v) => (
      <Chip
        key={v.type}
        type={v.type}
        src={v.src}
        selectedColor={v.selectedColor}
        onSelect={onFilter}
        selected={selectedType}
      />
    ))}
  </section>
);
