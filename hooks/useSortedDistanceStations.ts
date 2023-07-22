import * as geolib from "geolib";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { COMPUTE_DISTANCE_ACCURACY } from "../constants/location";
import { Station } from "../models/grpc";

const useSortedDistanceStations = (): Station[] => {
  const { location } = useAtomValue(navigationAtom);
  const { stations, selectedBound } = useAtomValue(stationAtom);

  const scoredStations = useMemo((): Station[] => {
    if (location && selectedBound) {
      const { latitude, longitude } = location.coords;

      const scored = stations.map((s) => {
        const distance = geolib.getDistance(
          { latitude, longitude },
          { latitude: s.latitude, longitude: s.longitude },
          COMPUTE_DISTANCE_ACCURACY
        );
        return { ...s, distance };
      });
      scored.sort((a, b) => {
        if (a.distance < b.distance) {
          return -1;
        }
        if (a.distance > b.distance) {
          return 1;
        }
        return 0;
      });
      return scored;
    }
    return [];
  }, [location, selectedBound, stations]);

  return scoredStations;
};

export default useSortedDistanceStations;
