import { useCallback, useEffect, useMemo, useState } from "react";
import { Line, Station } from "../models/StationAPI";
import getCurrentStationIndex from "../utils/currentStationIndex";
import { isYamanoteLine } from "../utils/loopLine";

const useRefreshNextStations = (
  stations: Station[],
  station: Station | undefined,
  selectedLine: Line | undefined,
  boundStation: Station | undefined | null
): Station[] => {
  const [nextStations, setNextStations] = useState<Station[]>([]);
  const direction = useMemo(() => {
    if (stations.findIndex((s) => s.groupId === boundStation?.groupId) === 0) {
      return "OUTBOUND";
    }
    return "INBOUND";
  }, [boundStation?.groupId, stations]);

  const getStationsForLoopLine = useCallback(
    (currentStationIndex: number): Station[] => {
      if (direction === "INBOUND") {
        if (currentStationIndex === 0) {
          // 山手線は折り返す
          return [stations[0], ...stations.slice().reverse().slice(0, 7)];
        }

        // 環状線表示駅残り少ない
        const inboundPendingStations = stations
          .slice(
            currentStationIndex - 7 > 0 ? currentStationIndex - 7 : 0,
            currentStationIndex + 1
          )
          .reverse();
        // 山手線と大阪環状線はちょっと処理が違う
        if (currentStationIndex < 7 && selectedLine?.id === 11623) {
          const nextStations = stations
            .slice()
            .reverse()
            .slice(currentStationIndex - 1, 7);
          return [...inboundPendingStations, ...nextStations];
        }

        if (currentStationIndex < 7 && isYamanoteLine(selectedLine?.id)) {
          const nextStations = stations
            .slice()
            .reverse()
            .slice(0, -(inboundPendingStations.length - 8));
          return [...inboundPendingStations, ...nextStations];
        }
        return inboundPendingStations;
      }

      // 環状線折返し駅
      if (currentStationIndex === stations.length - 1) {
        // 山手線は折り返す
        return [stations[currentStationIndex], ...stations.slice(0, 7)];
      }

      const outboundPendingStationCount =
        stations.length - currentStationIndex - 1;
      // 環状線表示駅残り少ない
      if (outboundPendingStationCount < 7) {
        return [
          ...stations.slice(currentStationIndex),
          ...stations.slice(0, 7 - outboundPendingStationCount),
        ];
      }

      return stations.slice(currentStationIndex, currentStationIndex + 8);
    },
    [direction, selectedLine, stations]
  );

  const getStations = useCallback(
    (currentStationIndex: number): Station[] => {
      if (direction === "OUTBOUND") {
        if (currentStationIndex === stations.length) {
          return stations.slice(currentStationIndex > 7 ? 7 : 0, 7).reverse();
        }

        const slicedStations = stations
          .slice(0, currentStationIndex + 1)
          .reverse();

        if (slicedStations.length < 8) {
          return stations.slice(0, 8).reverse();
        }
        return slicedStations;
      }
      const slicedStations = stations.slice(
        currentStationIndex,
        stations.length
      );

      if (slicedStations.length < 8 && stations.length > 8) {
        return stations.slice(stations.length - 8, stations.length);
      }
      return slicedStations;
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
    const ls = loopLine
      ? getStationsForLoopLine(currentIndex)
      : getStations(currentIndex);
    setNextStations(ls);
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

export default useRefreshNextStations;
