import { atom } from "jotai";
import { Station } from "../models/grpc";

type StationAtom = {
  station: Station | null;
  stations: Station[];
  selectedBound: Station | null;
};

export const stationAtom = atom<StationAtom>({
  station: null,
  stations: [],
  selectedBound: null,
});
