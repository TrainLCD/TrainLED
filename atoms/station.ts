import { atom } from "jotai";
import { Station } from "../generated/proto/stationapi_pb";

type StationAtom = {
  station: Station | null;
  passingStation: Station | null;
  stations: Station[];
  selectedBound: Station | null;
};

export const stationAtom = atom<StationAtom>({
  station: null,
  passingStation: null,
  stations: [],
  selectedBound: null,
});
