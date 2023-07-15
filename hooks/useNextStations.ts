import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { lineAtom } from "../atoms/line";
import { trainTypeAtom } from "../atoms/trainType";
import type { Line, Station } from "../models/grpc";
import getCurrentStationIndex from "../utils/currentStationIndex";
import { getIsLoopLine } from "../utils/loopLine";

const useNextStations = (
  stations: Station[],
  station: Station | null,
  selectedLine: Line | null
): Station[] => {
  const [nextStations, setNextStations] = useState<Station[]>([]);
  const { selectedDirection } = useAtomValue(lineAtom);
  const { trainType } = useAtomValue(trainTypeAtom);

  const getStationsForLoopLine = useCallback(
    (currentStationIndex: number): Station[] => {
      if (selectedDirection === "OUTBOUND") {
        const sliced = stations.slice(currentStationIndex);
        if (sliced.length === 1) {
          return [...sliced, ...stations];
        }
        return sliced;
      }
      const sliced = stations.slice(0, currentStationIndex + 1).reverse();
      if (sliced.length === 1) {
        return [...sliced, ...stations.slice().reverse()];
      }
      return sliced;
    },
    [selectedDirection, stations]
  );

  const getStations = useCallback(
    (currentStationIndex: number): Station[] => {
      if (selectedDirection === "OUTBOUND") {
        return stations.slice(0, currentStationIndex + 1).reverse();
      }
      return stations.slice(currentStationIndex);
    },
    [selectedDirection, stations]
  );

  useEffect(() => {
    const currentIndex = getCurrentStationIndex(stations, station);
    const ns = getIsLoopLine(selectedLine, trainType)
      ? getStationsForLoopLine(currentIndex)
      : getStations(currentIndex);
    setNextStations(ns);
  }, [
    getStations,
    getStationsForLoopLine,
    selectedLine,
    station,
    stations,
    trainType,
  ]);

  return nextStations;
};

export default useNextStations;
