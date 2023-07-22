import * as geolib from "geolib";
import { COMPUTE_DISTANCE_ACCURACY } from "../constants/location";
import type { Station } from "../models/grpc";

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

export const scoreStationDistances = (
  stations: Station[],
  latitude: number,
  longitude: number
): Station[] => {
  const scored = stations.map((station) => {
    const distance = geolib.getDistance(
      { latitude, longitude },
      { latitude: station.latitude, longitude: station.longitude }
    );
    return { ...station, distance };
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
};
