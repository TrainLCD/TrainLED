import { atom } from "jotai";

type NavigationAtom = {
  arrived: boolean;
  approaching: boolean;
  location: GeolocationPosition | null;
  loading: boolean;
};

export const navigationAtom = atom<NavigationAtom>({
  arrived: false,
  approaching: false,
  location: null,
  loading: false,
});
