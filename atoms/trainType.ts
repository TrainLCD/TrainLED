import { atom } from "jotai";
import { TrainType } from "../generated/proto/stationapi_pb";

type TrainTypeAtom = {
  trainType: TrainType | null;
  fetchedTrainTypes: TrainType[];
};

export const trainTypeAtom = atom<TrainTypeAtom>({
  trainType: null,
  fetchedTrainTypes: [],
});
