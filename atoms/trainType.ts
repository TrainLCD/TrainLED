import { atom } from "jotai";
import { TrainType } from "../models/grpc";

type TrainTypeAtom = {
  trainType: TrainType | null;
  fetchedTrainTypes: TrainType[];
};

export const trainTypeAtom = atom<TrainTypeAtom>({
  trainType: null,
  fetchedTrainTypes: [],
});
