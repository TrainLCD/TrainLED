import { useCallback, useEffect, useState } from "react";
import geolocationOptions from "../constants/geolocationOptions";
import { Line, LineType, Station } from "../models/StationAPI";
import {
  getAvgStationBetweenDistances,
  scoreStationDistances,
} from "../utils/distance";
import getNextStation from "../utils/getNextStation";
import getIsPass from "../utils/isPass";
import {
  getApproachingThreshold,
  getArrivedThreshold,
} from "../utils/threshold";
import useDirection from "./useDirection";

const useClosestStation = (
  station: Station | undefined,
  selectedBound: Station | undefined,
  stations: Station[],
  selectedLine: Line | undefined
): {
  arrived: boolean;
  approaching: boolean;
  newStation: Station | undefined;
} => {
  const [location, setLocation] = useState<GeolocationPosition>();
  const [arrived, setArrived] = useState(false);
  const [approaching, setApproaching] = useState(false);
  const [newStation, setNewStation] = useState<Station>();

  const displayedNextStation = getNextStation(stations, station);
  const direction = useDirection(selectedBound, stations);

  useEffect(() => {
    const noop = () => {};
    navigator.geolocation.watchPosition(
      setLocation,
      noop, // FIXME: エラー処理実装
      geolocationOptions
    );
  }, []);

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
        direction === "INBOUND"
          ? nearestStationIndex >= nextStationIndex
          : nearestStationIndex <= nextStationIndex;

      // APPROACHING_THRESHOLD以上次の駅から離れている: つぎは
      // APPROACHING_THRESHOLDより近い: まもなく
      return (
        (nearestStation.distance || 0) < APPROACHING_THRESHOLD &&
        isNearestStationLaterThanCurrentStop
      );
    },
    [direction, displayedNextStation, selectedLine?.lineType, stations]
  );

  useEffect(() => {
    if (!location || !selectedBound) {
      return;
    }
    const { latitude, longitude } = location.coords;

    const scoredStations = scoreStationDistances(stations, latitude, longitude);
    const nearestStation = scoredStations[0];
    const avg = getAvgStationBetweenDistances(stations);
    const arrived = isArrived(nearestStation, avg);
    const approaching = isApproaching(nearestStation, avg);

    setArrived(arrived);
    setApproaching(approaching);

    if (arrived) {
      setNewStation(nearestStation);
    }
  }, [isApproaching, isArrived, location, selectedBound, stations]);

  return { arrived, approaching, newStation };
};

export default useClosestStation;
