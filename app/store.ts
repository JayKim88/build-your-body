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
  programName: string;
  workoutTime: number;
  savedExercisesStatus: ExercisesStatus;
  completedAt?: Date;
  isRegistering: boolean;
  saveWorkoutTime: (v: number) => void;
  resetWorkoutTime: () => void;
  saveProgramInfo: (v: { id: string; name: string }) => void;
  resetProgramInfo: () => void;
  saveExercisesStatus: (v: ExercisesStatus) => void;
  resetExercisesStatus: () => void;
  saveCompletedAt: (v: Date) => void;
  resetCompletedAt: () => void;
  setIsRegistering: (v: boolean) => void;
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
      programName: "",
      workoutTime: 0,
      savedExercisesStatus: [],
      completedAt: undefined,
      isRegistering: false,
      saveWorkoutTime: (v: number) =>
        set(() => ({
          workoutTime: v,
        })),
      resetWorkoutTime: () =>
        set(() => ({
          workoutTime: 0,
        })),
      saveProgramInfo: ({ id, name }) =>
        set(() => ({
          programId: id,
          programName: name,
        })),
      resetProgramInfo: () =>
        set(() => ({
          programId: "",
          programName: "",
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
      setIsRegistering: (v: boolean) =>
        set(() => ({
          isRegistering: v,
        })),
    }),
    {
      name: "progressStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
