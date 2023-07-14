import { atom } from "jotai";
import { Station } from "../models/grpc";

type StationAtom = { station: Station | null; stations: Station[] };

export const stationAtom = atom<StationAtom>({ station: null, stations: [] });
