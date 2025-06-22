"use client";

import Image from "next/image";
import { ReactSortable } from "react-sortablejs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { RegisteredProgram } from "../api/types";
import { CartProps, useCartStore } from "../store";
import { ModalWrapper, OVERLAY_OPEN_DELAY } from "./ModalWrapper";
import Cart from "@/public/cart-icon/cart.svg";
import {
  capitalizeFirstLetter,
  getBgColor,
  handleNumberKeyDown,
} from "../utils";
import { CartTitleButton } from "./CartTitleButton";
import { Button } from "./Button";
import { ConfirmModal } from "./ConfirmModal";
import { registerProgram } from "../api/programs/register";
import { useBodySnackbar } from "../hook/useSnackbar";
import { deleteProgram } from "../api/programs/delete";
import { editProgram } from "../api/programs/edit";
import { useIsMobile } from "../hook/useWindowSize";
import { exerciseImageBlurDataURL } from "../utils/imageBlur";

type ConfirmTypes = "deleteAll" | "register" | "editConfirm" | "deleteProgram";

type CreateEditProgramModalProps = {
  isOpen: boolean;
  data?: RegisteredProgram;
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

type ExerciseInputProps = {
  title: string;
  value?: number;
  onChange: (title: string, value?: number) => void;
};

type ExerciseInputsProps = {
  id: string;
  onSettings: (v: ExerciseSettings) => void;
  exerciseSettings: ExerciseSet | undefined;
};

const Title = ({ isEdit }: { isEdit?: boolean }) => {
  return (
    <div className="flex gap-4 sm:gap-6 items-center">
      <Cart className="fill-gray6 w-10 sm:w-16" />
      <h1 className="text-2xl sm:text-5xl">
        {isEdit ? "Change your program" : "Make your new program"}
      </h1>
    </div>
  );
};

const ExerciseInput = ({ title, value, onChange }: ExerciseInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const decimalAvailable = title === "Weight";

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isEmpty = value === "";

      onChange(title, isEmpty ? undefined : Number(Number(value).toFixed(2)));
    },
    [title, onChange]
  );

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current?.addEventListener(
      "wheel",
      function (event) {
        event.stopPropagation();
      },
      { passive: false }
    );
  }, [inputRef]);

  return (
    <div className="flex relative items-center w-full">
      <span className="absolute top-[-24px] pb-2">{title}</span>
      <input
        ref={inputRef}
        className="w-full h-[48px] rounded-[32px] outline-none bg-gray6 
        text-black text-[20px] sm:text-2xl pl-4 pr-4 text-end"
        value={value ?? ""}
        onChange={handleInputChange}
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
}: ExerciseInputsProps) => {
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
    isEdit?: boolean;
  }
) => {
  const isMobile = useIsMobile();
  const {
    id,
    img_url,
    name,
    type,
    onDelete,
    onSettings,
    repeat,
    set,
    weight,
    isEdit,
  } = v;

  const bgColor = getBgColor(type);

  const handleDelete = useCallback(() => onDelete(id), [onDelete, id]);

  console.log("img_url", img_url);

  return (
    <div
      key={v.id}
      className={`${bgColor} w-full ${
        isEdit && isMobile ? "h-[180px]" : "h-[240px]"
      } rounded-3xl p-4 sm:p-5 flex gap-6 cursor-pointer`}
    >
      <div className="relative hidden sm:block min-w-[200px] h-[200px] rounded-2xl overflow-hidden">
        <Image
          src={img_url}
          alt={`${name} exercise`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 0px, 200px"
          priority
          placeholder="blur"
          blurDataURL={exerciseImageBlurDataURL}
        />
      </div>
      <div className="flex flex-col justify-between">
        <div className="text-2xl sm:text-4xl leading-10">
          {capitalizeFirstLetter(name)}
        </div>
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
        {!isEdit && (
          <div className="flex justify-end items-center w-full">
            <CartTitleButton
              title="Delete"
              onClick={handleDelete}
              className={"h-[44px]"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const CreateEditProgramModal = ({
  isOpen,
  onClose,
  data,
}: CreateEditProgramModalProps) => {
  const isMobile = useIsMobile();
  const { bodySnackbar } = useBodySnackbar();
  const cartItems = useCartStore((state) => state.stored);
  const removeFromCart = useCartStore((state) => state.remove);
  const removeAllFromCart = useCartStore((state) => state.removeAll);
  const addSettingsToCart = useCartStore((state) => state.addSettings);
  const storedProgramName = useCartStore((state) => state.programName);
  const storeProgramName = useCartStore((state) => state.setProgramName);
  const setUpdated = useCartStore((state) => state.setIsUpdated);
  const [loading, setLoading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState<ConfirmTypes>();
  const [programName, setProgramName] = useState("");
  const [exerciseSettings, setExerciseSettings] = useState<CartProps[]>([]);

  const isEdit = !!data;

  const handleExerciseSettings = useCallback((settings: ExerciseSettings) => {
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
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      removeFromCart(id);
      setExerciseSettings((prev) => prev.filter((v) => v.id !== id));
      exerciseSettings.length === 1 && storeProgramName("");
    },
    [removeFromCart, exerciseSettings.length, storeProgramName]
  );

  const handleCleanUpCart = useCallback(() => {
    removeAllFromCart();
    storeProgramName("");
    setExerciseSettings([]);
    setProgramName("");
  }, [removeAllFromCart, storeProgramName]);

  const handleClose = useCallback(() => {
    setTimeout(() => {
      if (isEdit) {
        setProgramName("");
        setExerciseSettings([]);
      } else {
        addSettingsToCart(exerciseSettings);
        storeProgramName(programName);
      }
    }, OVERLAY_OPEN_DELAY);

    onClose();
  }, [
    isEdit,
    exerciseSettings,
    programName,
    addSettingsToCart,
    storeProgramName,
    onClose,
  ]);

  const handleCreateEdit = async () => {
    setLoading(true);
    if (!exerciseSettings.length) return;

    const programArgs = {
      programName,
      exercises: exerciseSettings.map(({ chosen, ...rest }) => ({
        ...rest,
      })),
    };

    const { success, message } = isEdit
      ? (await editProgram({
          ...programArgs,
          programId: data._id,
        })) ?? {}
      : (await registerProgram(programArgs)) ?? {};

    bodySnackbar(message ?? "", {
      variant: !!success ? "success" : "error",
    });

    if (!success) {
      setLoading(false);
      return;
    }

    handleClose();
    setUpdated(true);
    setTimeout(() => handleCleanUpCart(), OVERLAY_OPEN_DELAY);
    setLoading(false);
  };

  const handleDeleteProgram = async () => {
    if (!data) return;
    const programId = data._id;

    const { success } = (await deleteProgram(programId)) ?? {};

    bodySnackbar(
      success ? "프로그램이 성공적으로 삭제되었습니다." : "에러가 발생했어요.",
      {
        variant: success ? "success" : "error",
      }
    );
    if (!success) return;
    setUpdated(true);
    handleClose();
  };

  const handleConfirm = async (isConfirm: boolean) => {
    const isDeleteAll = openConfirm === "deleteAll";
    const isDeleteProgram = openConfirm === "deleteProgram";

    if (isConfirm) {
      if (isEdit) {
        if (isDeleteProgram) {
          handleDeleteProgram();
        } else {
          handleCreateEdit();
        }
      } else {
        if (isDeleteAll) {
          handleCleanUpCart();
        } else {
          handleCreateEdit();
        }
      }
    }

    setOpenConfirm(undefined);
  };

  /**
   * @description 모달이 열릴때 프로그램 이름과 운동들 세팅
   */
  useEffect(() => {
    if (!isOpen) return;

    setProgramName(isEdit ? data.programName : storedProgramName);
    setExerciseSettings(isEdit ? data.exercises : cartItems);
    // eslint-disable-next-line
  }, [isOpen, data]);

  const isAllFilled = useMemo(() => {
    return (
      !!programName &&
      exerciseSettings.every((v) => v.repeat && v.set && v.weight)
    );
  }, [programName, exerciseSettings]);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      Title={<Title isEdit={isEdit} />}
    >
      <main className="flex flex-col gap-y-12 mt-2 overflow-auto">
        <div
          className={`flex relative items-center max-w-[480px] ${
            isEdit ? "gap-x-4" : "gap-x-6"
          }`}
        >
          <span className="text-2xl sm:text-4xl">Name:</span>
          {isEdit ? (
            <span className="text-2xl sm:text-4xl">{programName}</span>
          ) : (
            <input
              className="w-[200px] sm:w-[480px] h-[48px] sm:h-[64px] rounded-[32px] 
              outline-none bg-gray6 text-black text-2xl sm:text-4xl pl-6 pr-6 pb-0.5"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              placeholder="Program name"
              data-testid="program-name-input"
            />
          )}
        </div>
        {!isEdit && (
          <div className="flex gap-6 items-start">
            <span className="text-2xl sm:text-4xl">How to do ?</span>
            <ol className="list-decimal list-inside gap-y-3 text-1xl sm:text-3xl [&>li:not(:first-of-type)]:mt-2">
              <li>Order your exercises!</li>
              <li>Set up initial settings!</li>
              <li>Confirm!</li>
            </ol>
          </div>
        )}
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
                isEdit={isEdit}
              />
            ))}
          </ReactSortable>
        </section>
      </main>
      <footer className="flex justify-evenly gap-10 mt-8">
        <Button
          title={isEdit ? "Delete" : "Delete All"}
          onClick={() => setOpenConfirm(isEdit ? "deleteProgram" : "deleteAll")}
          className={"w-fit sm:w-[220px] h-[60px] bg-red"}
          fontSize={isMobile ? 20 : 32}
          disabled={loading}
          loading={loading}
        />
        <Button
          title={isEdit ? "Confirm" : "Register"}
          disabled={loading}
          loading={loading}
          onClick={() => {
            if (!isEdit && cartItems.length < 2) {
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

            if (isEdit) {
              const { programName: initialProgramName, exercises } = data!;

              const identicalExercises =
                JSON.stringify(exercises) === JSON.stringify(exerciseSettings);

              const identicalProgramName = initialProgramName === programName;

              if (identicalExercises && identicalProgramName) {
                bodySnackbar("내용을 변경해주세요.", {
                  variant: "warning",
                });

                return;
              }
            }

            setOpenConfirm(isEdit ? "editConfirm" : "register");
          }}
          className={"w-fit sm:w-[220px] h-[60px] bg-lightGreen"}
          fontSize={isMobile ? 20 : 32}
        />
      </footer>
      <ConfirmModal isOpen={!!openConfirm} onClick={handleConfirm} />
    </ModalWrapper>
  );
};
