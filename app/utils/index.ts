import { ExerciseType, exerciseTypes } from "../component/Filter";

function getBgColor(v: ExerciseType) {
  const bgColor = exerciseTypes.find(
    (t) => t.type.toLowerCase() === v.toLowerCase()
  )?.selectedColor;

  return bgColor;
}

export { getBgColor };
