import type { Line } from '@/generated/src/proto/stationapi_pb';
import { atom } from 'jotai';

type Direction = 'INBOUND' | 'OUTBOUND';

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
