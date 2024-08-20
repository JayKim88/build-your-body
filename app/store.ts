import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ExerciseType } from "./component/Filter";
import { ExerciseSet } from "./component/CreateEditProgramModal";
import { ExercisesStatus } from "./my-programs/[programId]/Progress";

export type CartProps = {
  id: string;
  name: string;
  img_url: string;
  type: ExerciseType;
} & ExerciseSet & {
    chosen?: boolean; // react-sortablejs 에서 주입하는 인자
  };

interface CartState {
  isUpdated: boolean;
  programName: string;
  stored: CartProps[];
  add: (v: CartProps) => void;
  remove: (v: string) => void;
  removeAll: () => void;
  addSettings: (v: ExerciseSet[]) => void;
  setProgramName: (v: string) => void;
  setIsUpdated: (v: boolean) => void;
}

interface ProgressState {
  programId: string;
  workoutTime: number;
  saveWorkoutTime: (v: number) => void;
  resetWorkoutTime: () => void;
  saveProgramId: (v: string) => void;
  resetProgramId: () => void;
  saveExercisesStatus: (v: ExercisesStatus) => void;
  savedExercisesStatus: ExercisesStatus;
  resetExercisesStatus: () => void;
  completedAt?: Date;
  saveCompletedAt: (v: Date) => void;
  resetCompletedAt: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isUpdated: false,
      programName: "",
      stored: [],
      add: (v) =>
        set((state) => ({
          stored: !!state.stored.find((s) => s.id === v.id)
            ? state.stored
            : [...state.stored, v],
        })),
      remove: (id) =>
        set((state) => ({
          stored: state.stored.filter((v) => v.id !== id),
        })),
      removeAll: () =>
        set(() => ({
          stored: [],
        })),
      addSettings: (settings) =>
        set((state) => {
          const storedWithSettings = state.stored.map((v) => {
            const foundSettings = settings.find(
              (setting) => setting.id === v.id
            );

            if (foundSettings) {
              return {
                ...v,
                ...foundSettings,
              };
            }
            return v;
          });

          return {
            stored: storedWithSettings,
          };
        }),
      setProgramName: (v: string) =>
        set(() => ({
          programName: v,
        })),
      setIsUpdated: (v: boolean) =>
        set(() => ({
          isUpdated: v ?? false,
        })),
    }),
    {
      name: "cartStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      programId: "",
      workoutTime: 0,
      savedExercisesStatus: [],
      completedAt: undefined,
      saveWorkoutTime: (v: number) =>
        set(() => ({
          workoutTime: v,
        })),
      resetWorkoutTime: () =>
        set(() => ({
          workoutTime: 0,
        })),
      saveProgramId: (v: string) =>
        set(() => ({
          programId: v,
        })),
      resetProgramId: () =>
        set(() => ({
          programId: "",
        })),
      saveExercisesStatus: (v: ExercisesStatus) =>
        set(() => ({
          savedExercisesStatus: v,
        })),
      resetExercisesStatus: () =>
        set(() => ({
          savedExercisesStatus: [],
        })),
      saveCompletedAt: (v: Date) =>
        set((state) => ({
          completedAt: state.completedAt ?? v,
        })),
      resetCompletedAt: () =>
        set(() => ({
          completedAt: undefined,
        })),
    }),
    {
      name: "progressStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
