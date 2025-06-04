import { create } from "zustand";

interface StoreState {
  collapse: boolean;
  toggleCollapse: () => void;
}

export const useSidebarStore = create<StoreState>((set) => ({
  collapse: false,
  toggleCollapse: () =>
    set((state) => {
      return { collapse: !state.collapse };
    }),
}));
