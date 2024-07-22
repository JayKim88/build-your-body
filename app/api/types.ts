import { ExerciseType } from "../component/Filter";

export type Exercise = {
  _id: string;
  type: ExerciseType;
  name: string;
  summary: string;
  guide: string;
  thumbnail_img_url: string;
  gif_url: string;
  ref: string[];
};
