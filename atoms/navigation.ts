import { atom } from "jotai";

type Scenes = "LINE" | "SEARCH" | "BOUND" | "LED";

type NavigationAtom = {
  arrived: boolean;
  approaching: boolean;
  location: GeolocationPosition | null;
  scene: Scenes;
};

export const navigationAtom = atom<NavigationAtom>({
  arrived: false,
  approaching: false,
  location: null,
  scene: "LINE",
});
