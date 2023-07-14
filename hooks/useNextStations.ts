import { useCallback, useEffect, useMemo, useState } from "react";
import type { Line, Station } from "../models/grpc";
import getCurrentStationIndex from "../utils/currentStationIndex";
import { isYamanoteLine } from "../utils/loopLine";
import useDirection from "./useDirection";

const useNextStations = (
  stations: Station[],
  station: Station | null,
  selectedLine: Line | null,
  boundStation: Station | null
): Station[] => {
  const [nextStations, setNextStations] = useState<Station[]>([]);
  const direction = useDirection(boundStation, stations);

  const getStationsForLoopLine = useCallback(
    (currentStationIndex: number): Station[] => {
      if (direction === "OUTBOUND") {
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
    [direction, stations]
  );

  const getStations = useCallback(
    (currentStationIndex: number): Station[] => {
      if (direction === "OUTBOUND") {
        return stations.slice(0, currentStationIndex + 1).reverse();
      }
      return stations.slice(currentStationIndex);
    },
    [direction, stations]
  );

  const loopLine = useMemo(() => {
    if (selectedLine?.id === 11623) {
      return false;
    }
    return isYamanoteLine(selectedLine?.id) || selectedLine?.id === 11623;
  }, [selectedLine]);

  useEffect(() => {
    const currentIndex = getCurrentStationIndex(stations, station);
    const ns = loopLine
      ? getStationsForLoopLine(currentIndex)
      : getStations(currentIndex);
    setNextStations(ns);
  }, [
    direction,
    getStations,
    getStationsForLoopLine,
    loopLine,
    selectedLine,
    station,
    stations,
  ]);

  return nextStations;
};

export default useNextStations;
