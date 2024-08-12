import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ExerciseType } from "./component/Filter";
import { ExerciseSet } from "./component/CreateEditProgramModal";

export type CartProps = {
  id: string;
  name: string;
  img_url: string;
  type: ExerciseType;
} & ExerciseSet & {
    chosen?: boolean; // react-sortablejs 에서 주입하는 인자
  };

interface CartState {
  programName: string;
  stored: CartProps[];
  add: (v: CartProps) => void;
  remove: (v: string) => void;
  removeAll: () => void;
  addSettings: (v: ExerciseSet[]) => void;
  setProgramName: (v: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
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
        set((state) => ({
          programName: v ?? state.programName,
        })),
    }),
    {
      name: "cartStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
