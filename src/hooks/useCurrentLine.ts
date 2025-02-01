import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { lineAtom } from '../atoms/line';
import { stationAtom } from '../atoms/station';
import { useCurrentStation } from './useCurrentStation';

export const useCurrentLine = () => {
  const { stations } = useAtomValue(stationAtom);
  const { selectedLine, selectedDirection } = useAtomValue(lineAtom);
  const currentStation = useCurrentStation();

  const actualCurrentStation = useMemo(
    () =>
      (selectedDirection === 'INBOUND'
        ? stations.slice().reverse()
        : stations
      ).find((rs) => rs.groupId === currentStation?.groupId),
    [currentStation?.groupId, selectedDirection, stations]
  );

  // NOTE: selectedLineがnullishの時はcurrentLineもnullishであってほしい
  return selectedLine && actualCurrentStation?.line;
};
