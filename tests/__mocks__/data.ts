import { Exercise } from "@/app/api/types";
import { ExerciseType } from "@/app/component/Filter";

export const mockExercises: Exercise[] = [
  {
    _id: "1",
    type: "chest",
    name: "Bench Press",
    description: "A chest exercise",
    summary: "Bench press summary",
    guide: ["Step 1", "Step 2"],
    thumbnail_img_url: "/bench-press.png",
    video_url: "https://youtube.com/bench",
    ref: [{ title: "Ref1", url: "https://ref1.com" }],
  },
  {
    _id: "2",
    type: "back",
    name: "Pull Up",
    description: "A back exercise",
    summary: "Pull up summary",
    guide: ["Step 1", "Step 2"],
    thumbnail_img_url: "/pull-up.png",
    video_url: "https://youtube.com/pullup",
    ref: [{ title: "Ref2", url: "https://ref2.com" }],
  },
  {
    _id: "3",
    type: "leg",
    name: "Squat",
    description: "A leg exercise",
    summary: "Squat summary",
    guide: ["Step 1", "Step 2"],
    thumbnail_img_url: "/squat.png",
    video_url: "https://youtube.com/squat",
    ref: [{ title: "Ref3", url: "https://ref3.com" }],
  },
];

// Mock data for Stats Dashboard integration tests
export const mockTotalSummary = {
  liftByType: [
    { type: "chest", lift: 300000 },
    { type: "back", lift: 209904 },
    { type: "leg", lift: 160000 },
  ],
  totalWorkout: 87,
};

export const mockPrograms = [
  {
    _id: "1",
    programName: "Hypertrophy Routine",
    deleted: false,
    userId: "user1",
    exercises: [],
  },
  {
    _id: "2",
    programName: "Strength Builder",
    deleted: false,
    userId: "user1", // Add this
    exercises: [],
  },
  {
    _id: "3",
    programName: "Leg Day Special",
    deleted: true,
    userId: "user1", // Add this
    exercises: [],
  },
];

export const mockHistoryChartData = [
  {
    name: "Hypertrophy Routine",
    type: "chest",
    items: [
      { date: "2024-06-01", lift: 100 },
      { date: "2024-06-02", lift: 200 },
    ],
  },
  {
    name: "Strength Builder",
    type: "back",
    items: [
      { date: "2024-06-01", lift: 150 },
      { date: "2024-06-02", lift: 250 },
    ],
  },
];

export const mockProgramData = {
  _id: "program1",
  userId: "user1",
  programName: "Test Program",
  exercises: [
    {
      id: "ex1",
      name: "Push Up",
      img_url: "/pushup.png",
      type: "chest" as ExerciseType,
      set: 2,
      weight: 10,
      repeat: 10,
      exerciseSetValues: [
        { order: 1, weight: 10, repeat: 10, checked: false },
        { order: 2, weight: 20, repeat: 8, checked: false },
      ],
      isCompleted: false,
    },
    {
      id: "ex2",
      name: "Pull Up",
      img_url: "/pullup.png",
      type: "back" as ExerciseType,
      set: 2,
      weight: 10,
      repeat: 10,
      exerciseSetValues: [
        { order: 1, weight: 20, repeat: 5, checked: false },
        { order: 2, weight: 30, repeat: 5, checked: false },
      ],
      isCompleted: false,
    },
  ],
  deleted: false,
};
