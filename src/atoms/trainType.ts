import type { TrainType } from '@/generated/src/proto/stationapi_pb';
import { atom } from 'jotai';

type TrainTypeAtom = {
  selectedTrainType: TrainType | null;
  trainTypes: TrainType[];
};

export const trainTypeAtom = atom<TrainTypeAtom>({
  selectedTrainType: null,
  trainTypes: [],
});
