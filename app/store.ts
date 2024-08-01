import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ExerciseType } from "./component/Filter";

export type CartProps = {
  id: string;
  name: string;
  img_url: string;
  type: ExerciseType;
};

interface CartState {
  stored: CartProps[];
  add: (v: CartProps) => void;
  remove: (v: string) => void;
  removeAll: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      stored: [],
      add: (v) => {
        return set((state) => ({
          stored: !!state.stored.find((s) => s.id === v.id)
            ? state.stored
            : [...state.stored, v],
        }));
      },
      remove: (id) =>
        set((state) => ({
          stored: state.stored.filter((v) => v.id !== id),
        })),
      removeAll: () =>
        set(() => ({
          stored: [],
        })),
    }),
    {
      name: "cartStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
