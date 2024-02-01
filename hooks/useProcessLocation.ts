import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { lineAtom } from "../atoms/line";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { LineType, Station } from "../generated/proto/stationapi_pb";
import {
  getAvgStationBetweenDistances,
  getNearestStation,
} from "../utils/distance";
import getNextStation from "../utils/getNextStation";
import getIsPass from "../utils/isPass";
import {
  getApproachingThreshold,
  getArrivedThreshold,
} from "../utils/threshold";
import useCurrentPosition from "./useCurrentPosition";

const useProcessLocation = () => {
  const [{ station, stations, selectedBound }, setStationAtom] =
    useAtom(stationAtom);
  const { selectedDirection, selectedLine } = useAtomValue(lineAtom);
  const [{ location }, setNavigationAtom] = useAtom(navigationAtom);

  const watchIdRef = useRef<number | null>(null);

  const displayedNextStation = useMemo(
    () => getNextStation(stations, station),
    [station, stations]
  );

  const handlePositionUpdate = useCallback(
    (location: GeolocationPosition) => {
      setNavigationAtom((prev) => ({ ...prev, location }));
    },
    [setNavigationAtom]
  );

  const { watchPosition } = useCurrentPosition({
    onPositionUpdate: handlePositionUpdate,
  });

  const isArrived = useCallback(
    (nearestStation: Station, avgDistance: number): boolean => {
      if (!nearestStation) {
        return false;
      }
      const ARRIVED_THRESHOLD = getArrivedThreshold(
        selectedLine?.lineType,
        avgDistance
      );
      return (nearestStation.distance || 0) < ARRIVED_THRESHOLD;
    },
    [selectedLine?.lineType]
  );

  const isApproaching = useCallback(
    (nearestStation: Station, avgDistance: number): boolean => {
      if (!displayedNextStation || !nearestStation) {
        return false;
      }
      const APPROACHING_THRESHOLD = getApproachingThreshold(
        selectedLine?.lineType,
        avgDistance
      );
      // 一番近い駅が通過駅で、次の駅が停車駅の場合、
      // 一番近い駅に到着（通過）した時点でまもなく扱いにする
      const isNextStationIsNextStop =
        displayedNextStation?.id !== nearestStation.id &&
        getIsPass(nearestStation) &&
        !getIsPass(displayedNextStation);
      if (
        isNextStationIsNextStop &&
        selectedLine?.lineType !== LineType.BulletTrain
      ) {
        return true;
      }

      const nearestStationIndex = stations.findIndex(
        (s) => s.id === nearestStation.id
      );
      const nextStationIndex = stations.findIndex(
        (s) => s.id === displayedNextStation?.id
      );
      const isNearestStationLaterThanCurrentStop =
        selectedDirection === "INBOUND"
          ? nearestStationIndex >= nextStationIndex
          : nearestStationIndex <= nextStationIndex;

      // APPROACHING_THRESHOLD以上次の駅から離れている: つぎは
      // APPROACHING_THRESHOLDより近い: まもなく
      return (
        (nearestStation.distance || 0) < APPROACHING_THRESHOLD &&
        isNearestStationLaterThanCurrentStop
      );
    },
    [displayedNextStation, selectedDirection, selectedLine?.lineType, stations]
  );

  useEffect(() => {
    if (!selectedBound) {
      return () => {
        watchIdRef.current &&
          navigator.geolocation.clearWatch(watchIdRef.current);
      };
    }

    watchIdRef.current = watchPosition();
    return () => {
      watchIdRef.current &&
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [selectedBound, watchPosition]);

  useEffect(() => {
    if (!location || !selectedBound) {
      return;
    }
    const { latitude, longitude } = location.coords;

    const station = getNearestStation(stations, latitude, longitude);
    if (!station) {
      return;
    }

    const avg = getAvgStationBetweenDistances(stations);
    const arrived = isArrived(station, avg);
    const approaching = isApproaching(station, avg);

    setNavigationAtom((prev) => ({ ...prev, arrived, approaching }));

    if (arrived) {
      setStationAtom((prev) => ({ ...prev, station }));
    }
  }, [
    isApproaching,
    isArrived,
    location,
    selectedBound,
    setNavigationAtom,
    setStationAtom,
    stations,
    watchPosition,
  ]);
};

export default useProcessLocation;
