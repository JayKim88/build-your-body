"use client";

import Image from "next/image";
import { capitalizeFirstLetter } from "../utils";
import { useSession } from "next-auth/react";

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

type FilterProps = {
  onFilter: (v: ExerciseType) => void;
  selectedType: ExerciseType;
  onSetShowMyData?: (v: boolean) => void;
  showMyData?: boolean;
};

export const exerciseTypes: Omit<ChipProps, "onSelect" | "selected">[] = [
  {
    type: "all",
    selectedBgColor: "bg-orange",
  },
  {
    type: "chest",
    src: "/filter-icon/chest.webp",
    selectedBgColor: "bg-lightRed",
  },
  {
    type: "back",
    src: "/filter-icon/back.webp",
    selectedBgColor: "bg-yellow",
  },
  {
    type: "leg",
    src: "/filter-icon/leg.webp",
    selectedBgColor: "bg-blue",
  },
  {
    type: "shoulder",
    src: "/filter-icon/shoulder.webp",
    selectedBgColor: "bg-green",
  },
  {
    type: "arm",
    src: "/filter-icon/arm.webp",
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
  onSetShowMyData,
  showMyData,
}: FilterProps) => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <section
      className="fixed top-[130px] z-10 flex flex-col md:flex-row justify-between 
    bg-black w-[calc(100%-24px)] md:w-[calc(100%-110px)]"
    >
      <section
        className="flex overflow-auto gap-4 h-[80px] sm:h-[120px] items-end 
      pb-4 flex-wrap px-2 scale-90 sm:scale-100 origin-left"
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
      {!!onSetShowMyData && isLoggedIn && (
        <div
          className={`flex gap-x-[20px] w-fit text-[40px] justify-between items-center 
            sm:items-end right-[100px] p-4`}
        >
          <div className="text-2xl sm:text-4xl">Show my list</div>
          <label className="switch scale-75 sm:scale-100 origin-left">
            <input
              type="checkbox"
              onChange={(e) => onSetShowMyData(e.target.checked)}
              checked={showMyData}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}
    </section>
  );
};
