import { UserWithRelations } from "@/entities/user/model/user-with-relations";

import { create } from "zustand";

interface StoreState {
  user: UserWithRelations | null;
  setUser: (user: UserWithRelations) => void;
  logout: () => void;
  isPending: boolean;
  setIsPending: (isPending: boolean) => void;
}

export const useAuthStore = create<StoreState>((set) => ({
  user: null,
  isPending: true,
  setUser: (user: UserWithRelations) =>
    set((state) => {
      return { user };
    }),
  logout: () =>
    set((state) => {
      return { user: null };
    }),
  setIsPending: (isPending: boolean) =>
    set((state) => {
      return { isPending };
    }),
}));
