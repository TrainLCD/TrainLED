import type { Station } from '@/generated/src/proto/stationapi_pb';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { lineAtom } from '../atoms/line';
import { stationAtom } from '../atoms/station';
import {
  dropEitherJunctionStation,
  getNextInboundStopStation,
  getNextOutboundStopStation,
} from '../utils';
import { useCurrentStation } from './useCurrentStation';
import { useLoopLine } from './useLoopLine';

export const useNextStation = (
  ignorePass = true,
  originStation?: Station
): Station | undefined => {
  const { stations: stationsFromState } = useAtomValue(stationAtom);
  const { selectedDirection } = useAtomValue(lineAtom);
  const currentStation = useCurrentStation();
  const { isLoopLine } = useLoopLine();

  const station = useMemo(
    () => originStation ?? currentStation,
    [originStation, currentStation]
  );

  const stations = useMemo(
    () => dropEitherJunctionStation(stationsFromState, selectedDirection),
    [selectedDirection, stationsFromState]
  );

  const actualNextStation = useMemo(() => {
    if (isLoopLine) {
      const loopLineStationIndex =
        selectedDirection === 'INBOUND'
          ? stations.findIndex((s) => s?.groupId === station?.groupId) - 1
          : stations.findIndex((s) => s?.groupId === station?.groupId) + 1;

      if (!stations[loopLineStationIndex]) {
        return stations[
          selectedDirection === 'INBOUND' ? stations.length - 1 : 0
        ];
      }

      return stations[loopLineStationIndex];
    }

    const notLoopLineStationIndex =
      selectedDirection === 'INBOUND'
        ? stations.findIndex((s) => s?.groupId === station?.groupId) + 1
        : stations.findIndex((s) => s?.groupId === station?.groupId) - 1;

    return stations[notLoopLineStationIndex];
  }, [isLoopLine, selectedDirection, station?.groupId, stations]);

  const nextInboundStopStation = useMemo(
    () =>
      actualNextStation &&
      station &&
      getNextInboundStopStation(
        stations,
        actualNextStation,
        station,
        ignorePass
      ),
    [actualNextStation, ignorePass, station, stations]
  );

  const nextOutboundStopStation = useMemo(
    () =>
      actualNextStation &&
      station &&
      getNextOutboundStopStation(
        stations,
        actualNextStation,
        station,
        ignorePass
      ),
    [actualNextStation, ignorePass, station, stations]
  );

  return (
    (selectedDirection === 'INBOUND'
      ? nextInboundStopStation
      : nextOutboundStopStation) ?? undefined
  );
};
