import { atom } from "jotai";
import { Line } from "../models/grpc";

type LineAtom = { selectedLine: Line | null };

export const lineAtom = atom<LineAtom>({ selectedLine: null });
