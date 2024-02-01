import { atom } from "jotai";
import { TrainType } from "../generated/proto/stationapi_pb";

type TrainTypeAtom = {
  selectedTrainType: TrainType | null;
  trainTypes: TrainType[];
};

export const trainTypeAtom = atom<TrainTypeAtom>({
  selectedTrainType: null,
  trainTypes: [],
});
