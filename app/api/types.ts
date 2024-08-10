import { ExerciseType } from "../component/Filter";
import { CartProps } from "../store";

export type Exercise = {
  _id: string;
  type: ExerciseType;
  name: string;
  description: string;
  summary: string;
  guide: string[];
  thumbnail_img_url: string;
  video_url: string;
  ref: {
    title: string;
    url: string;
  }[];
};

export type RegisteredProgram = {
  _id: string;
  userId: string;
  programName: string;
  exercises: CartProps[];
};
