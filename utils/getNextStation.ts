import type { Station } from "../models/StationAPI";

const getNextStation = (
  nextStations: Station[],
  station: Station | undefined
): Station | undefined => {
  const index =
    nextStations.findIndex((s) => s?.groupId === station?.groupId) + 1;
  return nextStations[index];
};

export default getNextStation;
