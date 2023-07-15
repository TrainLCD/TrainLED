import { atom } from "jotai";
import { Line } from "../models/grpc";

type Direction = "INBOUND" | "OUTBOUND";

type LineAtom = {
  selectedLine: Line | null;
  selectedDirection: Direction | null;
};

export const lineAtom = atom<LineAtom>({
  selectedLine: null,
  selectedDirection: null,
});
