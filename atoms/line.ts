import { atom } from "jotai";
import { Line } from "../generated/proto/stationapi_pb";

type Direction = "INBOUND" | "OUTBOUND";

type LineAtom = {
  selectedLine: Line | null;
  selectedDirection: Direction | null;
};

export const lineAtom = atom<LineAtom>({
  selectedLine: null,
  selectedDirection: null,
});
