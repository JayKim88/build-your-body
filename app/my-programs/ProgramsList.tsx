"use client";

import { SnackbarProvider } from "notistack";
import { ReactSortable } from "react-sortablejs";
import Image from "next/image";

import { RegisteredProgram } from "../api/types";
import { Button } from "../component/Button";
import { CartProps } from "../store";
import { getBgColor } from "../utils";
import { useEffect, useState } from "react";

type EditableExerciseCardProps = {
  data: CartProps;
};

const EditableExerciseCard = ({ data }: EditableExerciseCardProps) => {
  const { id, type, img_url, name } = data ?? {};

  const bgColor = getBgColor(type);

  return (
    <div
      key={id}
      className={`${bgColor} w-[300px] h-fit rounded-3xl p-5 gap-y-6 flex flex-col cursor-pointer`}
      // onClick={() => onClick(id)}
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
    </div>
  );
};

const ProgramItem = (data: RegisteredProgram) => {
  const [isEdit, setIsEdit] = useState(false);
  const [exercises, setExercises] = useState<CartProps[]>([]);

  const { exercises: initialExercises, programName, userId } = data ?? {};

  useEffect(() => {
    setExercises(initialExercises);
  }, [initialExercises]);

  return (
    <div className="bg-gray1 rounded-[32px] p-5 gap-y-6 flex flex-col w-fit">
      <header className="flex justify-between h-20">
        <div className="flex items-center gap-x-8">
          <h1 className="text-4xl">{programName}</h1>
          {!isEdit && (
            <Button
              title="Enter"
              onClick={() => {}}
              className="min-w-[120px] text-black bg-gray6 hover:bg-realGreen hover:text-gray6 h-20"
              fontSize={48}
            />
          )}
        </div>
        <div className="flex items-center gap-x-4 [&>img]:cursor-pointer w-[112px]">
          {isEdit ? (
            <>
              <Image
                src="/save.png"
                alt="save"
                width={48}
                height={48}
                onClick={() => {}}
              />
              <Image
                src="/cancel.png"
                alt="cancel"
                width={48}
                height={48}
                onClick={() => {
                  setIsEdit(false);
                  setExercises(initialExercises);
                }}
              />
            </>
          ) : (
            <>
              <Image
                src="/edit.png"
                alt="edit"
                width={48}
                height={48}
                onClick={() => {
                  setIsEdit(true);
                }}
              />
              <Image
                src="/delete_bin.png"
                alt="delete"
                width={48}
                height={48}
              />
            </>
          )}
        </div>
      </header>
      <ReactSortable
        list={exercises}
        setList={setExercises}
        animation={200}
        style={{
          display: "flex",
          columnGap: 24,
        }}
        disabled={!isEdit}
      >
        {exercises?.map((exercise) => (
          <EditableExerciseCard key={exercise.id} data={exercise} />
        ))}
      </ReactSortable>
    </div>
  );
};

const ProgramsList = ({ data }: { data?: RegisteredProgram[] }) => {
  console.log("data in program list", data);

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

export { ProgramsList };
