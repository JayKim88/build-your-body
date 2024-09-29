"use client";

import { useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";
import { format } from "date-fns";

import { RegisteredProgram } from "../api/types";
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

export const Chip = ({ text }: { text: string }) => {
  return (
    <span className="rounded-[32px] bg-black text-gray6 h-9 w-fit flex justify-center items-center p-2">
      {text}
    </span>
  );
};

const ProgramItem = (data: RegisteredProgram) => {
  const savedProgramId = useProgressStore((state) => state.programId);
  const setUpdated = useCartStore((state) => state.setIsUpdated);
  const router = useRouter();
  const { bodySnackbar } = useBodySnackbar();
  const [editOpen, setEditOpen] = useState(false);
  const [editProgram, setEditProgram] = useState<RegisteredProgram>();
  const [clicked, setClicked] = useState<string>();
  const [openConfirm, setOpenConfirm] = useState(false);

  const {
    exercises: initialExercises,
    programName,
    _id,
    lastCompletedAt,
  } = data ?? {};

  const handleConfirm = async (v: boolean) => {
    if (v) {
      const { success } = (await deleteProgram(_id)) ?? {};

      bodySnackbar(
        success
          ? "프로그램이 성공적으로 삭제되었습니다."
          : "에러가 발생했어요.",
        {
          variant: success ? "success" : "error",
        }
      );

      if (!success) return;
      setOpenConfirm(false);
      setUpdated(true);
      return;
    }

    setOpenConfirm(false);
  };

  const isInprogress = !!savedProgramId;
  const isProgramInprogress = isInprogress && savedProgramId === _id;

  return (
    <div className="bg-gray1 rounded-[32px] p-5 gap-y-6 flex flex-col w-fit">
      <header className="flex flex-col relative">
        {lastCompletedAt && (
          <span className="flex justify-start items-center gap-x-1 border-2 w-fit p-2 rounded-[32px]">
            <PngIcon name="calendar" className="w-[24px] h-[24px]" />
            last performed on: {format(lastCompletedAt, "yyyy.MM.dd")}
          </span>
        )}
        <div className="flex justify-between h-20">
          <div
            className={`flex items-center gap-x-8 ${
              isProgramInprogress ? "justify-between w-full" : ""
            }`}
          >
            <h1 className="text-4xl">{programName}</h1>
            {isInprogress ? (
              isProgramInprogress ? (
                <Button
                  title="Continue"
                  onClick={() => router.push(`/my-programs/${_id}`)}
                  className="min-w-[120px] text-black bg-gray6 hover:bg-realGreen hover:text-gray6 h-16"
                  fontSize={40}
                />
              ) : (
                <></>
              )
            ) : (
              <Button
                title="Enter"
                onClick={() => router.push(`/my-programs/${_id}`)}
                className="min-w-[120px] text-black bg-gray6 hover:bg-realGreen hover:text-gray6 h-16"
                fontSize={40}
              />
            )}
          </div>
          {!isProgramInprogress && (
            <div className="flex items-center gap-x-4 [&>img]:cursor-pointer w-[112px]">
              <Image
                src="/edit.png"
                alt="edit"
                width={48}
                height={48}
                onClick={() => {
                  setEditOpen(true);
                  setEditProgram(data);
                }}
              />
              <Image
                src="/delete_bin.png"
                alt="delete"
                width={48}
                height={48}
                onClick={() => setOpenConfirm(true)}
              />
            </div>
          )}
        </div>
      </header>
      <main className="flex gap-x-6">
        {initialExercises?.map((exercise) => (
          <ExerciseSummaryCard
            key={exercise.id}
            data={exercise}
            onClick={(v) => setClicked(v)}
          />
        ))}
      </main>
      <ExerciseDetailModal
        isOpen={!!clicked}
        onClose={() => setClicked(undefined)}
        exerciseId={clicked}
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
      <ConfirmModal isOpen={!!openConfirm} onClick={handleConfirm} />
    </div>
  );
};

const ProgramList = ({ data }: { data?: RegisteredProgram[] }) => {
  const { data: session } = useSession();
  const isUpdated = useCartStore((state) => state.isUpdated);
  const setUpdated = useCartStore((state) => state.setIsUpdated);
  const [programList, setProgramList] = useState<RegisteredProgram[]>(
    data ?? []
  );

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

  return (
    <div className="flex flex-col gap-y-8 overflow-auto max-w-[calc(100vw-110px)]">
      <SnackbarProvider>
        {programList?.map((v) => (
          <ProgramItem key={v._id} {...v} />
        ))}
      </SnackbarProvider>
    </div>
  );
};

export { ProgramList };
