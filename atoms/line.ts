import { atom } from "jotai";
import { Line } from "../generated/proto/stationapi_pb";

type Direction = "INBOUND" | "OUTBOUND";

type LineAtom = {
  averageDistance: number | null;
  selectedLine: Line | null;
  selectedDirection: Direction | null;
};

export const lineAtom = atom<LineAtom>({
  averageDistance: null,
  selectedLine: null,
  selectedDirection: null,
});
