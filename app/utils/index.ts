import { KeyboardEvent } from "react";
import { ExerciseType, exerciseTypes } from "../component/Filter";

function getBgColor(v: ExerciseType) {
  const bgColor = exerciseTypes.find(
    (t) => t.type.toLowerCase() === v.toLowerCase()
  )?.selectedColor;

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

export { getBgColor, handleNumberKeyDown };
