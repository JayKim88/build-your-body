"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import { MyStat as PerformedData } from "../api/types";
import { ExerciseType } from "../component/Filter";
import { capitalizeFirstLetter } from "../utils";
import { SatisfictionIcon } from "../component/SatisfactionIcon";
import Like from "@/public/like.svg";
import { ProgramHistoryDetailModal } from "../component/ProgramHistoryDetailModal";
import { editCommunitiesList } from "../api/communities/editData";

type PerformedProgramsProps = {
  data?: PerformedData[];
  selectedType: ExerciseType;
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
  };

  useEffect(() => {
    const likeClicked = likedUserIds?.some((v) => v === memberUserId);
    setLiked(!!likeClicked);
    setLikedCount(likedUserIds?.length ?? 0);
  }, []);

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
            <div className="flex justify-between">
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
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
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

const PerformedPrograms = ({
  data,
  selectedType,
  userId,
}: PerformedProgramsProps) => {
  const { data: session } = useSession();
  const [communitiesData, setCommunitiesData] = useState<PerformedData[]>([]);
  const [clickedProgram, setClickedProgram] = useState<PerformedData | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showMyData, setShowMyData] = useState(false);

  const handleClickProgram = (id: string) => {
    const data = communitiesData.find((v) => v._id === id) ?? null;
    setClickedProgram(data);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!data?.length) return;

    const filteredData =
      selectedType === "all"
        ? data
        : data.filter((v) =>
            v.savedExercisesStatus.some(
              (status) => status.type === selectedType
            )
          );

    setCommunitiesData(
      filteredData.filter((v) =>
        showMyData ? v.userId === userId : v.userId !== userId
      )
    );
  }, [data, selectedType, showMyData]);

  const isLoggedIn = !!session;

  return (
    <>
      <section className="flex gap-6 flex-wrap relative">
        {isLoggedIn && (
          <div
            className={`${defaultRowStyles} items-center w-fit absolute -top-[72px] right-0`}
          >
            <div className="text-4xl">Show my list</div>
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) => setShowMyData(e.target.checked)}
                checked={showMyData}
              />
              <span className="slider round"></span>
            </label>
          </div>
        )}
        {communitiesData.length ? (
          communitiesData.map((data) => (
            <PerformedProgramCard
              key={data._id}
              {...data}
              onClick={handleClickProgram}
              memberUserId={userId}
              isLoggedIn={isLoggedIn}
            />
          ))
        ) : (
          <></>
        )}
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

const defaultRowStyles = "flex gap-x-[50px] text-[40px] justify-between";
