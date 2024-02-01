import * as geolib from "geolib";
import { COMPUTE_DISTANCE_ACCURACY } from "../constants/location";
import { Station } from "../generated/proto/stationapi_pb";

// 駅配列から平均駅間距離（直線距離）を求める
export const getAvgStationBetweenDistances = (stations: Station[]): number =>
  !stations.length
    ? 0
    : stations.reduce((acc, cur, idx, arr) => {
        const prev = arr[idx - 1];
        if (!prev) {
          return acc;
        }
        const { latitude, longitude } = cur;
        const { latitude: prevLatitude, longitude: prevLongitude } = prev;
        const distance = geolib.getDistance(
          { latitude, longitude },
          { latitude: prevLatitude, longitude: prevLongitude },
          COMPUTE_DISTANCE_ACCURACY
        );
        return acc + distance;
      }, 0) / stations.length;

export const getNearestStation = (
  stations: Station[],
  latitude: number,
  longitude: number
): Station | null => {
  const nearestCoords = geolib.findNearest(
    { latitude, longitude },
    stations.map((s) => ({ latitude: s.latitude, longitude: s.longitude }))
  ) as { latitude: number; longitude: number };

  const nearestStation = stations.find(
    (s) =>
      s.latitude == nearestCoords.latitude &&
      s.longitude === nearestCoords.longitude
  );

  if (!nearestStation) {
    return null;
  }
  const distance = geolib.getDistance(
    { latitude, longitude },
    { latitude: nearestStation.latitude, longitude: nearestStation.longitude }
  );
  return new Station({ ...nearestStation, distance });
};
