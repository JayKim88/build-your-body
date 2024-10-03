"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import { MyStat as PerformedData } from "../api/types";
import { capitalizeFirstLetter } from "../utils";
import { SatisfictionIcon } from "../component/SatisfactionIcon";
import Like from "@/public/like.svg";
import { ProgramHistoryDetailModal } from "../component/ProgramHistoryDetailModal";
import { editCommunitiesList } from "../api/community/editData";

type PerformedProgramsProps = {
  data?: PerformedData[];
  userId?: string;
};

const PerformedProgramCard = (
  props: PerformedData & {
    onClick: (v: string) => void;
    memberUserId?: string;
    isLoggedIn: boolean;
  }
) => {
  const [liked, setLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    _id,
    imageUrl,
    title,
    savedProgramName,
    note,
    onClick,
    satisfiedStatus,
    savedExercisesStatus,
    completedAt,
    memberUserId,
    likedUserIds,
    isLoggedIn,
  } = props;

  const liftsByExercise = savedExercisesStatus.map((v) => {
    const lift = v.exerciseSetValues.reduce((acc, cur) => {
      return acc + (cur.repeat ?? 0) * (cur.weight ?? 0);
    }, 0);

    return {
      name: v.name,
      lift,
    };
  });

  const handleLike = async () => {
    const result = await editCommunitiesList({
      userId: memberUserId!,
      performedProgramId: _id!,
      isLike: !liked,
    });

    if (!result?.success) return;

    setLikedCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
    setLoading(false);
  };

  useEffect(() => {
    const likeClicked = likedUserIds?.some((v) => v === memberUserId);
    setLiked(!!likeClicked);
    setLikedCount(likedUserIds?.length ?? 0);
  }, [likedUserIds, memberUserId]);

  return (
    <div
      key={_id}
      className={`bg-gray1 w-[384px] rounded-3xl p-5 gap-y-5 flex 
        flex-col cursor-pointer justify-between`}
      onClick={() => onClick(_id)}
    >
      <div className="flex gap-x-1 items-center">
        <div className="text-[28px] truncate">{title}</div>
        <SatisfictionIcon status={satisfiedStatus} />
      </div>
      <div
        className={`relative w-full min-h-[260px] max-h-[260px] h-72 
          rounded-2xl overflow-hidden flex items-center justify-center 
          ${imageUrl ? "" : "border-2"}
          `}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="name"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 1200px) 100vw 100vh"
            priority
          />
        ) : (
          <span className="text-[48px]">No Image</span>
        )}
      </div>

      <div>
        <div className="flex gap-x-2 items-center text-[20px]">
          <span>Program Name:</span>
          <div className="truncate">
            {capitalizeFirstLetter(savedProgramName)}
          </div>
        </div>
        <div className="flex gap-x-2 items-center text-[20px]">
          <span>Completed At:</span>
          <span>{completedAt && format(completedAt, "yyyy/MM/dd")}</span>
        </div>
      </div>
      <div className="text-[18px] truncate">{note}</div>
      <div className="border-2 rounded-2xl p-2 text-[20px]">
        {liftsByExercise.map((v) => {
          return (
            <div key={v.name} className="flex justify-between">
              <span>{v.name}</span>
              <span>{`${v.lift.toLocaleString()} kg`}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end">
        <div className="flex items-center gap-x-1">
          <button
            className={`${
              isLoggedIn ? "pointer-events-auto" : "pointer-events-none"
            }`}
            onClick={async (e) => {
              setLoading(true);
              e.stopPropagation();
              if (loading) return;
              await handleLike();
            }}
          >
            <Like
              className={`${
                liked || (!isLoggedIn && !!likedCount)
                  ? "fill-red"
                  : "fill-transparent"
              } scale-75`}
            />
          </button>
          <span className="text-3xl">{likedCount}</span>
        </div>
      </div>
    </div>
  );
};

const PerformedPrograms = ({ data, userId }: PerformedProgramsProps) => {
  const { data: session } = useSession();

  const [clickedProgram, setClickedProgram] = useState<PerformedData | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleClickProgram = (id: string) => {
    const program = data?.find((v) => v._id === id) ?? null;
    setClickedProgram(program);
    setIsOpen(true);
  };

  const isLoggedIn = !!session;

  return (
    <>
      <section className="flex gap-6 flex-wrap relative">
        <section className="flex gap-6 flex-wrap mt-20">
          {data?.length ? (
            data.map((program) => (
              <PerformedProgramCard
                key={program._id}
                {...program}
                onClick={handleClickProgram}
                memberUserId={userId}
                isLoggedIn={isLoggedIn}
              />
            ))
          ) : (
            <></>
          )}
        </section>
      </section>
      <ProgramHistoryDetailModal
        isOpen={isOpen}
        data={clickedProgram}
        onClose={() => {
          setIsOpen(false);
        }}
        isCommunitiesPage
      />
    </>
  );
};

export { PerformedPrograms };
