import isPointWithinRadius from "geolib/es/isPointWithinRadius";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { ARRIVED_MAXIMUM_SPEED } from "../constants/threshold";
import getIsPass from "../utils/isPass";
import { useNearestStation } from "./useNearestStation";
import { useNextStation } from "./useNextStation";
import { useThreshold } from "./useThreshold";

export const useRefreshStation = (): void => {
  const setStation = useSetAtom(stationAtom);
  const [{ location }, setNavigation] = useAtom(navigationAtom);

  const nextStation = useNextStation(true);
  const nearestStation = useNearestStation();
  const { arrivedThreshold, approachingThreshold } = useThreshold();

  const isArrived = useMemo((): boolean => {
    if (!location || !nearestStation) {
      return true;
    }

    const {
      coords: { latitude, longitude, speed },
    } = location;

    const speedKMH = ((speed ?? 0) * 3600) / 1000;

    if (!getIsPass(nearestStation)) {
      return (
        isPointWithinRadius(
          { latitude, longitude },
          {
            latitude: nearestStation.latitude,
            longitude: nearestStation.longitude,
          },
          arrivedThreshold,
        ) && speedKMH < ARRIVED_MAXIMUM_SPEED
      );
    }

    return isPointWithinRadius(
      { latitude, longitude },
      {
        latitude: nearestStation.latitude,
        longitude: nearestStation.longitude,
      },
      arrivedThreshold,
    );
  }, [arrivedThreshold, location, nearestStation]);

  const isApproaching = useMemo((): boolean => {
    if (!location || !nextStation) {
      return false;
    }

    const {
      coords: { latitude, longitude },
    } = location;

    return isPointWithinRadius(
      { latitude, longitude },
      {
        latitude: nextStation.latitude,
        longitude: nextStation.longitude,
      },
      approachingThreshold,
    );
  }, [approachingThreshold, location, nextStation]);

  useEffect(() => {
    if (!nearestStation) {
      return;
    }

    setStation((prev) => ({
      ...prev,
      passingStation: isArrived && getIsPass(nearestStation)
        ? nearestStation
        : null,
      station: isArrived && !getIsPass(nearestStation)
        ? nearestStation
        : prev.station,
    }));
    setNavigation((prev) => ({
      ...prev,
      approaching: isApproaching,
      arrived: isArrived,
    }));
  }, [isApproaching, isArrived, nearestStation, setNavigation, setStation]);
};
