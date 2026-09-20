import type { UserProfile } from "@fgc-monitor/shared";
import { create } from "zustand";

type ProfileState = {
  userProfile: UserProfile | null;
  photoUrl: string | null;
};

type ProfileAction = {
  setProfile: (userProfile: UserProfile) => void;
  setPhotoUrl: (photoUrl: string | null) => void;
  clearProfile: () => void;
};

const useProfileStore = create<ProfileState & ProfileAction>()((set) => ({
  userProfile: null,
  photoUrl: null,
  setProfile: (userProfile) => set(() => ({ userProfile })),
  setPhotoUrl: (photoUrl) =>
    set((state) => {
      if (state.photoUrl) {
        URL.revokeObjectURL(state.photoUrl);
      }

      return { photoUrl };
    }),
  clearProfile: () => set(() => ({ userProfile: null })),
}));

export { useProfileStore };
