import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface CartState {
  stored: string[];
  add: (v: string) => void;
  remove: (v: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      stored: [],
      add: (id) => {
        return set((state) => ({
          stored: !!state.stored.find((v) => v === id)
            ? state.stored
            : [...state.stored, id],
        }));
      },
      remove: (id) =>
        set((state) => ({
          stored: state.stored.filter((v) => v !== id),
        })),
    }),
    {
      name: "cartStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
