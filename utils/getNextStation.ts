import { Station } from "../generated/proto/stationapi_pb";

const getNextStation = (
  nextStations: Station[],
  station: Station | null
): Station | null => {
  const index =
    nextStations.findIndex((s) => s?.groupId === station?.groupId) + 1;
  return nextStations[index];
};

export default getNextStation;
