import Image from "next/image";
import { CartProps } from "../store";
import { capitalizeFirstLetter, getBgColor } from "../utils";
import { Chip } from "../my-programs/ProgramList";

type ExerciseSummaryCardProps = {
  data: CartProps;
  onClick: (v: string) => void;
};

export const ExerciseSummaryCard = ({
  data,
  onClick,
}: ExerciseSummaryCardProps) => {
  const { id, type, img_url, name, repeat, set, weight } = data ?? {};

  const bgColor = getBgColor(type);

  return (
    <div
      key={id}
      className={`${bgColor} w-[300px] h-fit rounded-3xl p-5 gap-y-6 flex flex-col cursor-pointer`}
      onClick={() => onClick(id)}
    >
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
      <div className="text-[32px]">{capitalizeFirstLetter(name)}</div>
      <div className="flex gap-x-2">
        <Chip text={`${weight} kg`} />
        <Chip text={`${repeat} times`} />
        <Chip text={`${set} sets`} />
      </div>
    </div>
  );
};
