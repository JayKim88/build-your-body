import Image from "next/image";
import { useEffect, useState } from "react";

import { capitalizeFirstLetter, getBgColor } from "../utils";
import { ExercisesStatus } from "../my-programs/[programId]/Progress";
import { SpinLoader } from "./SpinLoader";

export type ProgramHistoryDetailCardProps = {
  data: ExercisesStatus[0];
  onClick: (v: string) => void;
};

export const ProgramHistoryDetailCard = ({
  data,
  onClick,
}: ProgramHistoryDetailCardProps) => {
  const [loading, setLoading] = useState(false);
  const { id, img_url, name, type, exerciseSetValues } = data ?? {};
  const bgColor = getBgColor(type);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [loading]);

  return (
    <div
      key={id}
      className={`${bgColor} w-fit h-fit sm:w-[300px] sm:min-w-[300px] rounded-3xl p-5 gap-y-6 flex flex-col 
      cursor-pointer relative`}
      onClick={() => {
        setLoading(true);
        onClick(id);
      }}
    >
      {loading && <SpinLoader />}
      <div className="text-[30px]">{capitalizeFirstLetter(name)}</div>
      <div className="relative w-full h-[260px] rounded-2xl overflow-hidden">
        <Image
          src={img_url}
          alt="name"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1200px) 100vw"
          priority
        />
      </div>
      <div className="flex flex-col gap-y-2">
        {exerciseSetValues.map((v) => {
          const order = v.order;
          const weight = v.weight;
          const repeat = v.repeat;

          return (
            <div
              key={v.order}
              className="flex justify-around items-center rounded-[32px] 
              h-[50px] px-1 bg-black text-[18px] min-w-[200px]"
            >
              <span className="w-fit">{order} set</span>
              <span className="w-fit">{weight?.toLocaleString()} kg</span>
              <span className="w-fit">{repeat} times</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
