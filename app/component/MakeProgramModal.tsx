"use client";

import Image from "next/image";
import { ReactSortable } from "react-sortablejs";

import { Exercise } from "../api/types";
import { CartProps, useCartStore } from "../store";
import { ModalWrapper } from "./ModalWrapper";
import { Cart } from "../icon/Cart";
import { getBgColor } from "../utils";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { CartTitleButton } from "./CartTitleButton";
import { Button } from "./Button";
import { ConfirmModal } from "./ConfirmModal";
import { registerProgram } from "../api/register-program/register";
import { useBodySnackbar } from "../hook/useSnackbar";

type MakeProgramModalProps = {
  isOpen: boolean;
  data?: Exercise;
  onClose: () => void;
};

type ExerciseSettings = {
  id: string;
  title: string;
  value?: number;
};

export type ExerciseSet = {
  id?: string;
  weight?: number;
  repeat?: number;
  set?: number;
};

const Title = () => {
  return (
    <div className="flex gap-6 items-center">
      <Cart className="text-gray6 w-14 h-14" />
      <h1 className="text-5xl">Make your new program</h1>
    </div>
  );
};

const handleNumberKeyDown = (
  event: KeyboardEvent<HTMLInputElement>,
  decimalAvailable: boolean
) => {
  const key = event.key;
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];

  // Allow control keys
  if (allowedKeys.includes(key)) {
    return;
  }

  // Prevent non-numeric and decimal point keys
  if (decimalAvailable ? !/^[0-9.]$/.test(key) : !/^[0-9]$/.test(key)) {
    event.preventDefault();
  }

  // Prevent multiple decimal points
  const value = (event.target as HTMLInputElement).value;
  if (key === "." && value.includes(".")) {
    event.preventDefault();
  }
};

const ExerciseInput = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value?: number;
  onChange: (title: string, value?: number) => void;
}) => {
  const decimalAvailable = title === "Weight";

  return (
    <div className="flex relative items-center w-full">
      <span className="absolute top-[-24px]">{title}</span>
      <input
        className="border-2 border-gray2 w-full h-[48px] rounded-[32px] outline-none bg-gray6 text-black text-2xl pl-4 pr-4 text-end"
        value={value ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          const isEmpty = value === "";

          onChange(title, isEmpty ? undefined : Number(value));
        }}
        {...(decimalAvailable && {
          placeholder: "kg",
        })}
        onKeyDown={(event) => handleNumberKeyDown(event, decimalAvailable)}
        type="number"
        min={0}
        {...(!decimalAvailable && {
          step: 1,
        })}
      />
    </div>
  );
};

const ExerciseInputs = ({
  id,
  onSettings,
  exerciseSettings,
}: {
  id: string;
  onSettings: (v: ExerciseSettings) => void;
  exerciseSettings: ExerciseSet | undefined;
}) => {
  const handleExerciseSettings = (title: string, value?: number) => {
    onSettings({
      id: id,
      title,
      value,
    });
  };

  return (
    <div className="flex items-center gap-x-4 mt-5">
      <ExerciseInput
        title="Weight"
        onChange={handleExerciseSettings}
        value={exerciseSettings?.weight}
      />
      x
      <ExerciseInput
        title="Repeat"
        onChange={handleExerciseSettings}
        value={exerciseSettings?.repeat}
      />
      x
      <ExerciseInput
        title="Set"
        onChange={handleExerciseSettings}
        value={exerciseSettings?.set}
      />
    </div>
  );
};

const ExerciseSetting = (
  v: CartProps & {
    onDelete: (v: string) => void;
    onSettings: (v: ExerciseSettings) => void;
  }
) => {
  const { id, img_url, name, type, onDelete, onSettings, repeat, set, weight } =
    v;
  const bgColor = getBgColor(type);

  return (
    <div
      key={v.id}
      className={`${bgColor} w-full h-[240px] rounded-3xl p-5 flex gap-6 cursor-pointer`}
    >
      <div className="relative min-w-[200px] h-[200px] rounded-2xl overflow-hidden">
        <Image
          src={img_url}
          alt="name"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1200px) 100vw"
          priority
        />
      </div>
      <div className="flex flex-col justify-between">
        <div className="text-4xl leading-10">{name}</div>
        <ExerciseInputs
          id={id}
          onSettings={onSettings}
          exerciseSettings={{
            id,
            repeat,
            set,
            weight,
          }}
        />
        <div className="flex justify-end items-center w-full">
          <CartTitleButton
            title="Delete"
            onClick={() => onDelete(id)}
            className={"h-[44px]"}
          />
        </div>
      </div>
    </div>
  );
};

export const MakeProgramModal = ({
  isOpen,
  onClose,
}: MakeProgramModalProps) => {
  const { bodySnackbar } = useBodySnackbar();
  const cartItems = useCartStore((state) => state.stored);
  const removeFromCart = useCartStore((state) => state.remove);
  const removeAllFromCart = useCartStore((state) => state.removeAll);
  const addSettingsToCart = useCartStore((state) => state.addSettings);
  const storedProgramName = useCartStore((state) => state.programName);
  const storeProgramName = useCartStore((state) => state.setProgramName);

  const [openConfirm, setOpenConfirm] = useState<"deleteAll" | "register">();
  const [programName, setProgramName] = useState("");
  const [exerciseSettings, setExerciseSettings] = useState<CartProps[]>([]);

  const handleExerciseSettings = (settings: ExerciseSettings) => {
    setExerciseSettings((prev) => {
      return prev.map((v) => {
        if (v.id === settings.id) {
          return {
            ...v,
            [`${settings.title.toLowerCase()}`]: settings.value,
          };
        }
        return v;
      });
    });
  };

  const handleDelete = (id: string) => {
    removeFromCart(id);
    setExerciseSettings((prev) => prev.filter((v) => v.id !== id));
  };

  const handleDeleteAll = () => {
    removeAllFromCart();
    setProgramName("");
    setExerciseSettings([]);
  };

  const handleRegister = async () => {
    if (!exerciseSettings.length) return;

    const newProgram = {
      programName,
      exercises: exerciseSettings.map(({ chosen, ...rest }) => ({
        ...rest,
      })),
    };

    const { success } = (await registerProgram(newProgram)) ?? {};

    bodySnackbar(
      success ? "프로그램이 성공적으로 등록되었어요." : "에러가 발생했어요.",
      {
        variant: success ? "success" : "error",
      }
    );

    if (!success) return;
    handleDeleteAll();
  };

  /**
   * @description 모달이 닫힐때 전역에 저장
   */
  useEffect(() => {
    if (isOpen) return;
    addSettingsToCart(exerciseSettings);
    storeProgramName(programName);
  }, [
    isOpen,
    addSettingsToCart,
    exerciseSettings,
    programName,
    storeProgramName,
  ]);

  /**
   * @description 모달이 열릴때 프로그램 이름과 운동들 세팅
   */
  useEffect(() => {
    if (!isOpen) return;

    setProgramName(storedProgramName);
    setExerciseSettings(cartItems);
    // eslint-disable-next-line
  }, [isOpen]);

  const isAllFilled = useMemo(() => {
    return (
      !!programName &&
      exerciseSettings.every((v) => v.repeat && v.set && v.weight)
    );
  }, [programName, exerciseSettings]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} Title={<Title />}>
      <main className="flex flex-col gap-y-12 mt-2 overflow-auto">
        <div className="flex relative items-center w-[480px] gap-6">
          <span className="text-4xl">Name:</span>
          <input
            value={programName}
            onChange={(e) => {
              const value = e.target.value;
              setProgramName(value);
            }}
            className="border-2 border-gray2 w-[480px] h-[64px] rounded-[32px] outline-none bg-gray6 text-black text-4xl pl-6 pr-6 pb-0.5"
          />
        </div>
        <div className="flex gap-6 items-start">
          <span className="text-4xl">How to do ?</span>
          <ol className="list-decimal list-inside gap-y-3 text-3xl [&>li:not(:first-of-type)]:mt-2">
            <li>Order your exercises!</li>
            <li>Set up initial settings!</li>
            <li>Confirm!</li>
          </ol>
        </div>
        <section>
          <ReactSortable
            list={exerciseSettings}
            setList={setExerciseSettings}
            animation={200}
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 24,
            }}
          >
            {exerciseSettings.map((item) => (
              <ExerciseSetting
                key={item.id}
                {...item}
                onDelete={handleDelete}
                onSettings={handleExerciseSettings}
              />
            ))}
          </ReactSortable>
        </section>
      </main>
      <footer className="flex justify-evenly gap-10 mt-8">
        <Button
          title="Delete All"
          onClick={() => setOpenConfirm("deleteAll")}
          className={"w-[220px] h-[60px]"}
          fontSize={32}
          bgColor="red"
        />
        <Button
          title="Register"
          onClick={() => {
            if (cartItems.length < 2) {
              bodySnackbar(
                "프로그램은 적어도 2개의 운동으로 구성되어야 해요.",
                {
                  variant: "warning",
                }
              );
              return;
            }

            if (!isAllFilled) {
              bodySnackbar("입력된 값을 확인해주세요.", {
                variant: "warning",
              });
              return;
            }

            setOpenConfirm("register");
          }}
          className={"w-[220px] h-[60px]"}
          fontSize={32}
          bgColor="lightGreen"
        />
      </footer>
      <ConfirmModal
        isOpen={!!openConfirm}
        onClick={(isConfirm) => {
          const isDeleteAll = openConfirm === "deleteAll";

          if (isConfirm) {
            if (isDeleteAll) {
              handleDeleteAll();
            } else {
              handleRegister();
            }
          }
          setOpenConfirm(undefined);
        }}
      />
    </ModalWrapper>
  );
};
