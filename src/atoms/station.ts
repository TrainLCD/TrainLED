import type { Station } from '@/generated/src/proto/stationapi_pb';
import { atom } from 'jotai';

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
