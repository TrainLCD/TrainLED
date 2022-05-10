import { Station } from "../models/StationAPI";

const getCurrentStationIndex = (
  stations: Station[],
  nearestStation: Station | undefined
): number =>
  stations.findIndex(
    (s) =>
      s.name === nearestStation?.name || s.groupId === nearestStation?.groupId
  );

export default getCurrentStationIndex;
