import { KeyboardEvent } from "react";
import { ExerciseType, exerciseTypes } from "../component/Filter";

function getBgColor(v: ExerciseType) {
  const bgColor = exerciseTypes.find(
    (exerciseType) => exerciseType.type === v
  )?.selectedBgColor;

  return bgColor;
}

function handleNumberKeyDown(
  event: KeyboardEvent<HTMLInputElement>,
  decimalAvailable: boolean
) {
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
}

const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const formattedTime = (time: number, useColon?: boolean) => {
  if (useColon) {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = `${Math.floor(time / 60)}`;
    const getMinutes = `0${parseInt(minutes) % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  }

  const getSeconds = time % 60;
  const minutes = Math.floor(time / 60);
  const getMinutes = minutes % 60;
  const getHours = Math.floor(time / 3600);

  return `${getHours ? `${getHours}h` : ""}${
    getMinutes ? `${getMinutes}m` : ""
  }${getSeconds ? `${getSeconds}s` : ""}`;
};

export {
  getBgColor,
  handleNumberKeyDown,
  capitalizeFirstLetter,
  formattedTime,
};
