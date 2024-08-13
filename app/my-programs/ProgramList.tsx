"use client";

import { useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { RegisteredProgram } from "../api/types";
import { Button } from "../component/Button";
import { CartProps, useCartStore } from "../store";
import { getBgColor } from "../utils";
import { ExerciseDetailModal } from "../component/ExerciseDetailModal";
import { CreateEditProgramModal } from "../component/CreateEditProgramModal";
import { OVERLAY_OPEN_DELAY } from "../component/ModalWrapper";
import { deleteProgram } from "../api/programs/delete";
import { useBodySnackbar } from "../hook/useSnackbar";
import { ConfirmModal } from "../component/ConfirmModal";

type EditableExerciseCardProps = {
  data: CartProps;
  onClick: (v: string) => void;
};

export const Chip = ({ text }: { text: string }) => {
  return (
    <span className="rounded-[32px] bg-black text-gray6 h-9 w-fit flex justify-center items-center p-2">
      {text}
    </span>
  );
};

const SummaryExerciseCard = ({ data, onClick }: EditableExerciseCardProps) => {
  const { id, type, img_url, name, repeat, set, weight } = data ?? {};

  const bgColor = getBgColor(type);

  return (
    <div
      key={id}
      className={`${bgColor} w-[300px] h-fit rounded-3xl p-5 gap-y-6 flex flex-col cursor-pointer`}
      onClick={() => onClick(id)}
    >
      <div className="relative w-full h-72 rounded-2xl overflow-hidden">
        <Image
          src={img_url}
          alt="name"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1200px) 100vw"
          priority
        />
      </div>
      <div className="text-[32px]">{name}</div>
      <div className="flex gap-x-2">
        <Chip text={`${weight} kg`} />
        <Chip text={`${repeat} times`} />
        <Chip text={`${set} sets`} />
      </div>
    </div>
  );
};

const ProgramItem = (data: RegisteredProgram) => {
  const setUpdated = useCartStore((state) => state.setIsUpdated);
  const { bodySnackbar } = useBodySnackbar();
  const [editOpen, setEditOpen] = useState(false);
  const [editProgram, setEditProgram] = useState<RegisteredProgram>();
  const [clicked, setClicked] = useState<string>();
  const [openConfirm, setOpenConfirm] = useState(false);

  const { exercises: initialExercises, programName, _id } = data ?? {};

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

  return (
    <div className="bg-gray1 rounded-[32px] p-5 gap-y-6 flex flex-col w-fit">
      <header className="flex justify-between h-20">
        <div className="flex items-center gap-x-8">
          <h1 className="text-4xl">{programName}</h1>
          <Button
            title="Enter"
            onClick={() => {}}
            className="min-w-[120px] text-black bg-gray6 hover:bg-realGreen hover:text-gray6 h-20"
            fontSize={48}
          />
        </div>
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
      </header>
      <main className="flex gap-x-6">
        {initialExercises?.map((exercise) => (
          <SummaryExerciseCard
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
          }, OVERLAY_OPEN_DELAY + 200);
        }}
        data={editProgram}
      />
      <ConfirmModal isOpen={!!openConfirm} onClick={handleConfirm} />
    </div>
  );
};

const ProgramList = ({ data }: { data?: RegisteredProgram[] }) => {
  const router = useRouter();
  const isUpdated = useCartStore((state) => state.isUpdated);
  const setUpdated = useCartStore((state) => state.setIsUpdated);

  useEffect(() => {
    if (!isUpdated) return;
    router.refresh();
    setUpdated(false);
  }, [isUpdated]);

  return (
    <div className="flex flex-col gap-y-8">
      <SnackbarProvider>
        {data?.map((v) => (
          <ProgramItem key={v._id} {...v} />
        ))}
      </SnackbarProvider>
    </div>
  );
};

export { ProgramList };
