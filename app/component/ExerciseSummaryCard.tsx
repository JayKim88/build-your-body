import Image from "next/image";
import { useEffect, useState } from "react";

import { CartProps } from "../store";
import { capitalizeFirstLetter, getBgColor } from "../utils";
import { Chip } from "../my-programs/ProgramList";
import { SpinLoader } from "./SpinLoader";

export type ExerciseSummaryCardProps = {
  data: CartProps;
  onClick: (v: string) => void;
  isClicked?: boolean;
  index?: number;
};

export const ExerciseSummaryCard = ({
  data,
  onClick,
  index = 0,
}: ExerciseSummaryCardProps) => {
  const [loading, setLoading] = useState(false);
  const { id, type, img_url, name, repeat, set, weight } = data ?? {};
  const bgColor = getBgColor(type);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [loading]);

  return (
    <div
      key={id}
      className={`${bgColor} w-fit h-fit sm:w-[300px] sm:min-w-[300px] rounded-3xl p-5 
      gap-y-6 flex flex-col 
      cursor-pointer relative`}
      onClick={() => {
        setLoading(true);
        onClick(id);
      }}
    >
      {loading && <SpinLoader />}
      <div className="relative w-full h-[260px] rounded-2xl overflow-hidden">
        <Image
          src={img_url}
          alt={`${name} exercise summary`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 100vw, 240px"
          priority={index < 3}
        />
      </div>
      <div className="text-[20px] sm:text-[30px]">
        {capitalizeFirstLetter(name)}
      </div>
      <div className="flex gap-x-2 text-[16px] min-w-[200px]">
        <Chip text={`${weight} kg`} />
        <Chip text={`${repeat} times`} />
        <Chip text={`${set} sets`} />
      </div>
    </div>
  );
};
