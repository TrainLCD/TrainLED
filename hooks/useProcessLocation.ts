import { useAtom, useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { getAvgStationBetweenDistances } from "../utils/distance";
import {
  getApproachingThreshold,
  getArrivedThreshold,
} from "../utils/threshold";
import useCurrentLine from "./useCurrentLine";
import useSortedDistanceStations from "./useSortedDistanceStations";

const useProcessLocation = () => {
  const [{ stations, selectedBound }, setStationAtom] = useAtom(stationAtom);

  const setNavigationAtom = useSetAtom(navigationAtom);

  const currentLine = useCurrentLine();
  const sortedStations = useSortedDistanceStations();
  const nearestStation = useMemo(() => sortedStations[0], [sortedStations]);
  const avgDistance = getAvgStationBetweenDistances(stations);

  const isApproaching = useMemo((): boolean => {
    if (!nearestStation?.distance) {
      return false;
    }
    const APPROACHING_THRESHOLD = getApproachingThreshold(
      currentLine?.lineType,
      avgDistance
    );

    // APPROACHING_THRESHOLD以上次の駅から離れている: つぎは
    // APPROACHING_THRESHOLDより近い: まもなく
    return nearestStation.distance < APPROACHING_THRESHOLD;
  }, [avgDistance, currentLine?.lineType, nearestStation]);

  const isArrived = useMemo((): boolean => {
    if (!nearestStation) {
      return false;
    }
    const ARRIVED_THRESHOLD = getArrivedThreshold(
      currentLine?.lineType,
      avgDistance
    );
    return (nearestStation.distance || 0) < ARRIVED_THRESHOLD;
  }, [avgDistance, currentLine?.lineType, nearestStation]);

  useEffect(() => {
    if (!selectedBound) {
      return;
    }
    setNavigationAtom((prev) => ({
      ...prev,
      arrived: isArrived,
      approaching: isApproaching,
    }));

    if (isArrived) {
      setStationAtom((prev) => ({
        ...prev,
        station:
          !prev.station || prev.station.id !== nearestStation.id
            ? nearestStation
            : prev.station,
      }));
    }
  }, [
    isApproaching,
    isArrived,
    nearestStation,
    selectedBound,
    setNavigationAtom,
    setStationAtom,
  ]);
};

export default useProcessLocation;
