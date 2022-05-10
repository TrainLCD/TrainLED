import { useMemo } from "react";
import type { Station } from "../models/StationAPI";

const useDirection = (
  boundStation: Station | undefined,
  stations: Station[]
) => {
  const direction = useMemo(() => {
    if (stations.findIndex((s) => s.groupId === boundStation?.groupId) === 0) {
      return "OUTBOUND";
    }
    return "INBOUND";
  }, [boundStation?.groupId, stations]);
  return direction;
};

export default useDirection;
