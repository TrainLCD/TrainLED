import type { Station } from "../models/grpc";

const getCurrentStationIndex = (
  stations: Station[],
  nearestStation: Station | null
): number =>
  stations.findIndex(
    (s) =>
      s.name === nearestStation?.name || s.groupId === nearestStation?.groupId
  );

export default getCurrentStationIndex;
