import { atom } from "jotai";

type NavigationAtom = {
  arrived: boolean;
  approaching: boolean;
  autoModeEnabled: boolean;
  location: GeolocationPosition | null;
};

export const navigationAtom = atom<NavigationAtom>({
  arrived: false,
  approaching: false,
  autoModeEnabled: false,
  location: null,
});
