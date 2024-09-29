import { ExerciseType } from "../component/Filter";
import { CartProps } from "../store";
import { PerfomanceData } from "./program-complete/savePerformance";

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
  lastCompletedAt?: Date;
};

export type MyStat = {
  _id: string;
  userId: string;
  likedUserIds?: string[];
} & PerfomanceData;

export type TotalWorkoutSummary = {
  liftByType: {
    type: string;
    lift: number;
  }[];
  totalWorkout?: number;
  totalTargetDateWorkoutTime?: number;
};

export type WorkoutHistory = {
  _id: string;
  items: MyStat[];
}[];

export type HistoryChartData = {
  name: string;
  type: string;
  items: { date: string; lift: number }[];
}[];
