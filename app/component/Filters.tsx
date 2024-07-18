"use client";

import Image from "next/image";
import { useState } from "react";

type ChipProps = {
  title: string;
  src?: string;
  selectedColor: string;
  onSelect: (v: string) => void;
  selected?: string;
};

const chips: Omit<ChipProps, "onSelect" | "selected">[] = [
  {
    title: "All",
    selectedColor: "bg-orange",
  },
  {
    title: "Chest",
    src: "/filter-icon/chest.png",
    selectedColor: "bg-lightRed",
  },
  {
    title: "Back",
    src: "/filter-icon/back.png",
    selectedColor: "bg-yellow",
  },
  {
    title: "Leg",
    src: "/filter-icon/leg.png",
    selectedColor: "bg-blue",
  },

  {
    title: "Shoulder",
    src: "/filter-icon/shoulder.png",
    selectedColor: "bg-green",
  },

  {
    title: "Arm",
    src: "/filter-icon/arm.png",
    selectedColor: "bg-purple",
  },
];

const Chip = ({ title, src, selectedColor, onSelect, selected }: ChipProps) => {
  const isSelected = selected === title;

  return (
    <button
      onClick={() => {
        onSelect(title);
      }}
      className={`${isSelected ? selectedColor : "bg-gray2"}
       flex items-center justify-center gap-2 rounded-[32px] py-2 px-4 text-[20px] ${
         isSelected ? "" : "hover:bg-gray6 hover:text-black"
       }  
      `}
    >
      {src && <Image src={src} width={24} height={24} alt={title} />}
      <span>{title}</span>
    </button>
  );
};

export const Filters = () => {
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>();

  const handleSelectedFilter = (v: string) => {
    setSelectedFilter(v);
  };

  return (
    <section className="w-[1100px] flex overflow-auto gap-4 mt-8">
      {chips.map((v) => (
        <Chip
          key={v.title}
          title={v.title}
          src={v.src}
          selectedColor={v.selectedColor}
          onSelect={handleSelectedFilter}
          selected={selectedFilter}
        />
      ))}
    </section>
  );
};
