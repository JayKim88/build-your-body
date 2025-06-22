"use client";

import { useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";
import { format } from "date-fns";

import { MyStat, RegisteredProgram } from "../api/types";
import { Button } from "../component/Button";
import { useCartStore, useProgressStore } from "../store";
import { ExerciseDetailModal } from "../component/ExerciseDetailModal";
import { CreateEditProgramModal } from "../component/CreateEditProgramModal";
import { OVERLAY_OPEN_DELAY } from "../component/ModalWrapper";
import { deleteProgram } from "../api/programs/delete";
import { useBodySnackbar } from "../hook/useSnackbar";
import { ConfirmModal } from "../component/ConfirmModal";
import { ExerciseSummaryCard } from "../component/ExerciseSummaryCard";
import { PngIcon } from "./complete/WorkoutSummary";
import LottiePlayer from "../component/LottiePlayer";
import Loading from "../loading";
import { ProgramHistoryDetailModal } from "../component/ProgramHistoryDetailModal";
import { SpinLoader } from "../component/SpinLoader";
import { useIsMobile } from "../hook/useWindowSize";

type ProgramItemsProps = {
  data: RegisteredProgram[];
  onEnterClick: (v: boolean) => void;
};

type GetLastHistoryProps = {
  id: string;
  lastCompletedAt: string;
};

export const Chip = ({ text }: { text: string }) => {
  return (
    <span
      className="rounded-[32px] bg-black text-gray6 h-fit w-fit flex 
    justify-center items-center p-2"
    >
      {text}
    </span>
  );
};

const ProgramItem = (
  props: RegisteredProgram & {
    onEnterClick: (v: boolean) => void;
    onGetLastHistory: ({ id, lastCompletedAt }: GetLastHistoryProps) => void;
    onSetDeleteTargetId: (v: string) => void;
    onSetEditProgram: (v: RegisteredProgram) => void;
    onSetClickedId: (v: string) => void;
    isEditing: boolean;
  }
) => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const savedProgramId = useProgressStore((state) => state.programId);
  const router = useRouter();

  const {
    _id,
    userId,
    programName,
    lastCompletedAt,
    exercises: initialExercises,
    isEditing,
    onEnterClick,
    onGetLastHistory,
    onSetDeleteTargetId,
    onSetEditProgram,
    onSetClickedId,
  } = props ?? {};

  const isInprogress = !!savedProgramId;
  const isProgramInprogress = isInprogress && savedProgramId === _id;
  const isInprogressNotTarget = isInprogress && savedProgramId !== _id;

  const enterProgram = () => {
    onEnterClick(true);
    setTimeout(() => {
      router.push(`/my-programs/${_id}`, { scroll: false });
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [loading]);

  return (
    <div className="bg-gray1 rounded-[32px] p-5 gap-y-6 flex flex-col w-fit max-w-full">
      <header className="flex flex-col relative">
        {lastCompletedAt && (
          <span
            className="flex justify-start items-center gap-x-1 border-2 w-fit p-2
            rounded-[32px] cursor-pointer relative mb-2"
            onClick={() => {
              setLoading(true);
              onGetLastHistory({
                id: _id,
                lastCompletedAt,
              });
            }}
          >
            <PngIcon name="calendar" width={24} height={24} />
            last performed history on: {format(lastCompletedAt, "yyyy.MM.dd")}
            {loading && <SpinLoader />}
          </span>
        )}
        <div
          className={`flex justify-between h-fit gap-y-2 sm:gap-y-0 sm:flex-row ${
            isInprogressNotTarget ? "flex-row" : "flex-col"
          }`}
        >
          <div
            className={`flex items-center gap-x-8 justify-between sm:justify-normal ${
              isProgramInprogress ? "justify-between w-full" : ""
            }`}
          >
            <h1 className="text-2xl sm:text-4xl">{programName}</h1>
            {isInprogress ? (
              isProgramInprogress ? (
                <Button
                  title="Continue"
                  onClick={enterProgram}
                  className="min-w-[40px] sm:min-w-[120px] text-black
                   bg-gray6 hover:bg-realGreen hover:text-gray6 h-12 sm:h-16"
                  fontSize={isMobile ? 20 : 40}
                />
              ) : (
                <></>
              )
            ) : (
              <Button
                title="Enter"
                onClick={enterProgram}
                className="min-w-[40px] sm:min-w-[120px] text-black bg-gray6 
                hover:bg-realGreen hover:text-gray6 h-10 sm:h-16"
                fontSize={isMobile ? 20 : 40}
              />
            )}
          </div>
          {!isProgramInprogress && (
            <div
              className={`${
                isEditing ? "pointer-events-none" : ""
              } flex justify-end items-center gap-x-4 [&>img]:cursor-pointer w-full sm:w-[112px]`}
            >
              <Image
                src="/edit.png"
                alt="edit"
                width={isMobile ? 32 : 48}
                height={48}
                onClick={() =>
                  onSetEditProgram({
                    _id,
                    userId,
                    programName,
                    lastCompletedAt,
                    exercises: initialExercises,
                  })
                }
              />
              <Image
                src="/delete_bin.png"
                alt="delete"
                width={isMobile ? 32 : 48}
                height={48}
                onClick={() => onSetDeleteTargetId(_id)}
              />
            </div>
          )}
        </div>
      </header>
      <main className="flex gap-x-6 overflow-x-auto">
        {initialExercises?.map((exercise, index) => (
          <ExerciseSummaryCard
            key={exercise.id}
            data={exercise}
            index={index}
            onClick={(v) => onSetClickedId(v)}
          />
        ))}
      </main>
    </div>
  );
};

const ProgramItems = ({ data, onEnterClick }: ProgramItemsProps) => {
  const { data: session } = useSession();
  const { bodySnackbar } = useBodySnackbar();
  const isRegistering = useProgressStore((state) => state.isRegistering);
  const setIsRegistering = useProgressStore((state) => state.setIsRegistering);
  const setUpdated = useCartStore((state) => state.setIsUpdated);

  const [editOpen, setEditOpen] = useState(false);
  const [editProgram, setEditProgram] = useState<RegisteredProgram>();
  const [clickedId, setClickedId] = useState<string>();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [lastHistory, setLastHistory] = useState<MyStat | null>(null);
  const [lastHistoryModalOpen, setLastHistoryModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState("");

  const handleSetDeleteTargetId = (v: string) => setDeleteTargetId(v);
  const handleSetEditProgram = (v: RegisteredProgram) => setEditProgram(v);
  const handleSetClickedId = (v: string) => setClickedId(v);

  const cleanUpDelete = () => {
    setOpenDeleteConfirm(false);
    setDeleteTargetId("");
  };

  const handleDeleteConfirm = async (isConfirmed: boolean) => {
    if (isConfirmed) {
      const { success } = (await deleteProgram(deleteTargetId)) ?? {};

      bodySnackbar(
        success
          ? "프로그램이 성공적으로 삭제되었습니다."
          : "에러가 발생했어요.",
        {
          variant: success ? "success" : "error",
        }
      );

      if (!success) return;
      cleanUpDelete();
      setUpdated(true);
      return;
    }

    cleanUpDelete();
  };

  const getLastHistory = async ({
    id,
    lastCompletedAt,
  }: GetLastHistoryProps) => {
    const result = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
        params: {
          email: session?.user?.email,
          programId: id,
          lastCompletedAt,
        },
      })
      .then((res) => res.data);

    setLastHistory(result.data as MyStat);
  };

  useEffect(() => {
    if (!lastHistory) return;
    setLastHistoryModalOpen(true);
  }, [lastHistory]);

  useEffect(() => {
    if (!editProgram) return;
    setEditOpen(true);
  }, [editProgram]);

  useEffect(() => {
    if (!deleteTargetId) return;
    setOpenDeleteConfirm(true);
  }, [deleteTargetId]);

  useEffect(() => {
    if (!isRegistering) return;
    bodySnackbar("성공적으로 등록되었습니다.", {
      variant: "success",
    });
    setIsRegistering(false);
  }, [bodySnackbar, isRegistering, setIsRegistering]);

  return (
    <>
      {data?.map((v) => (
        <ProgramItem
          key={v._id}
          onEnterClick={onEnterClick}
          onGetLastHistory={getLastHistory}
          onSetDeleteTargetId={handleSetDeleteTargetId}
          onSetEditProgram={handleSetEditProgram}
          onSetClickedId={handleSetClickedId}
          isEditing={!!editProgram}
          {...v}
        />
      ))}
      <ExerciseDetailModal
        isOpen={!!clickedId}
        onClose={() => setClickedId(undefined)}
        exerciseId={clickedId}
      />
      <CreateEditProgramModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setTimeout(() => {
            setEditProgram(undefined);
          }, OVERLAY_OPEN_DELAY + 500);
        }}
        data={editProgram}
      />
      <ConfirmModal
        isOpen={!!openDeleteConfirm}
        onClick={handleDeleteConfirm}
      />
      <ProgramHistoryDetailModal
        isOpen={lastHistoryModalOpen}
        data={lastHistory}
        onClose={() => setLastHistoryModalOpen(false)}
      />
    </>
  );
};

const ProgramList = ({ data }: { data?: RegisteredProgram[] }) => {
  const { data: session } = useSession();
  const isUpdated = useCartStore((state) => state.isUpdated);
  const setUpdated = useCartStore((state) => state.setIsUpdated);
  const [programList, setProgramList] = useState<RegisteredProgram[]>(
    data ?? []
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnterLoading, setIsEnterLoading] = useState(false);

  const handleEnterLoading = (v: boolean) => setIsEnterLoading(v);
  const handleGetUpdatedPrograms = async () => {
    const fetchedData = (
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/programs`, {
          params: {
            email: session?.user?.email,
          },
        })
        .then((res) => res.data)
    ).data as RegisteredProgram[] | undefined;

    setProgramList(fetchedData ?? []);
  };

  useEffect(() => {
    if (!isUpdated) return;
    handleGetUpdatedPrograms();
    setUpdated(false);
    // eslint-disable-next-line
  }, [isUpdated]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const programRequired = programList.length === 0;

  return isEnterLoading ? (
    <Loading />
  ) : (
    <div
      className={`flex flex-col gap-y-8 overflow-y-auto max-w-full sm:max-w-[calc(100vw-110px)] 
    transition-opacity duration-300 mb-[100px]
    ${isLoaded ? "opacity-100" : "opacity-0"} 
    ${programRequired ? "items-center justify-center h-full" : ""}`}
    >
      {programRequired ? (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[400px] flex flex-col items-center justify-center"
        >
          <LottiePlayer
            type="cannotFind"
            style={{
              width: 300,
            }}
          />
          <span className="text-3xl">프로그램을 생성해주세요.</span>
        </div>
      ) : (
        <SnackbarProvider>
          <ProgramItems data={programList} onEnterClick={handleEnterLoading} />
        </SnackbarProvider>
      )}
    </div>
  );
};

export { ProgramList };
