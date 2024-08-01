"use client";

import Image from "next/image";

import { Exercise } from "../api/types";
import { CartProps, useCartStore } from "../store";
import { ModalWrapper, OVERLAY_OPEN_DELAY } from "./ModalWrapper";
import { Cart } from "../icon/Cart";
import { getBgColor } from "../utils";
import { KeyboardEvent, useEffect, useState } from "react";
import { CartTitleButton } from "./CartTitleButton";
import { Button } from "./Button";
import { ConfirmModal } from "./ConfirmModal";

type MakeProgramModalProps = {
  isOpen: boolean;
  data?: Exercise;
  onClose: () => void;
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
        className="border-2 border-gray2 w-full h-[48px] rounded-[32px] outline-none bg-gray6 text-black text-2xl pl-4 pr-4"
        value={value}
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

const ExerciseInputs = () => {
  const [conditions, setConditions] = useState<{
    weight?: number;
    repeat?: number;
    set?: number;
  }>({});

  const handleSetConditions = (title: string, value?: number) => {
    setConditions((prev) => ({
      ...prev,
      [`${title.toLowerCase()}`]: value,
    }));
  };

  return (
    <div className="flex items-center gap-x-4 mt-5">
      <ExerciseInput
        title="Weight"
        onChange={handleSetConditions}
        value={conditions.weight}
      />
      x
      <ExerciseInput
        title="Repeat"
        onChange={handleSetConditions}
        value={conditions.repeat}
      />
      x
      <ExerciseInput
        title="Set"
        onChange={handleSetConditions}
        value={conditions.set}
      />
    </div>
  );
};

const ExerciseSetting = (
  v: CartProps & {
    onDelete: (v: string) => void;
  }
) => {
  const { id, img_url, name, type, onDelete } = v;
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
        <ExerciseInputs />
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
  const [openConfirm, setOpenConfirm] = useState<"deleteAll" | "confirm">();
  const cartItems = useCartStore((state) => state.stored);
  const removeFromCart = useCartStore((state) => state.remove);
  const removeAllFromCart = useCartStore((state) => state.removeAll);

  const handleDelete = (v: string) => {
    removeFromCart(v);
  };

  const handleDeleteAll = () => {};

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} Title={<Title />}>
      <main className="flex flex-col gap-y-12 mt-2">
        <div className="flex relative items-center w-[480px] gap-6">
          <span className="text-4xl">Name:</span>
          <input className="border-2 border-gray2 w-[480px] h-[64px] rounded-[32px] outline-none bg-gray6 text-black text-4xl pl-6 pr-6 pb-0.5" />
        </div>
        <div className="flex gap-6 items-start">
          <span className="text-4xl">How to do ?</span>
          <ol className="list-decimal list-inside gap-y-3 text-3xl [&>li:not(:first-of-type)]:mt-2">
            <li>Order your exercises!</li>
            <li>Set up initial condition!</li>
            <li>Confirm!</li>
          </ol>
        </div>
        <section className="flex flex-col gap-y-6">
          {cartItems.map((v) => (
            <ExerciseSetting key={v.id} {...v} onDelete={handleDelete} />
          ))}
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
          title="Confirm"
          onClick={() => setOpenConfirm("confirm")}
          className={"w-[220px] h-[60px]"}
          fontSize={32}
          bgColor="lightGreen"
        />
      </footer>
      <ConfirmModal
        isOpen={!!openConfirm}
        onClick={(v) => {
          if (v) {
            setOpenConfirm(undefined);
          } else {
            setOpenConfirm(undefined);
          }
        }}
      />
    </ModalWrapper>
  );
};
