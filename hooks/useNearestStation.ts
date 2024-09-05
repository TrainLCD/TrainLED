import findNearest from "geolib/es/findNearest";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { Station } from "../generated/proto/stationapi_pb";

export const useNearestStation = (): Station | null => {
  const { location } = useAtomValue(navigationAtom);
  const { stations } = useAtomValue(stationAtom);

  const nearestStation = useMemo<Station | null>(() => {
    if (!location) {
      return null;
    }
    const {
      coords: { latitude, longitude },
    } = location;

    const nearestCoordinates = stations.length
      ? (findNearest(
          {
            latitude,
            longitude,
          },
          stations.map((sta) => ({
            latitude: sta.latitude,
            longitude: sta.longitude,
          }))
        ) as { latitude: number; longitude: number })
      : null;

    if (!nearestCoordinates) {
      return null;
    }

    return (
      stations.find(
        (sta) =>
          sta.latitude === nearestCoordinates.latitude &&
          sta.longitude === nearestCoordinates.longitude
      ) ?? null
    );
  }, [location, stations]);

  return nearestStation;
};
