import { useEffect, useState } from "react";
import type { Line, Station } from "../models/grpc";
import getCurrentStationIndex from "../utils/currentStationIndex";
import {
  inboundStationForLoopLine,
  isYamanoteLine,
  outboundStationForLoopLine,
} from "../utils/loopLine";

const useBounds = (
  stations: Station[],
  station: Station | null,
  selectedLine: Line | null
) => {
  const [bounds, setBounds] = useState<[Station | null, Station | null]>();

  useEffect(() => {
    const currentIndex = getCurrentStationIndex(stations, station);

    const yamanoteLine = isYamanoteLine(selectedLine?.id);

    const inbound = inboundStationForLoopLine(
      stations,
      currentIndex,
      selectedLine
    );
    const outbound = outboundStationForLoopLine(
      stations,
      currentIndex,
      selectedLine
    );

    const inboundStation = stations[stations.length - 1];
    const outboundStation = stations[0];

    let computedInboundStation: Station | null = null;
    let computedOutboundStation: Station | null = null;
    if (yamanoteLine) {
      if (inbound) {
        computedInboundStation = inbound.station;
        computedOutboundStation = outboundStation;
      } else if (outbound) {
        computedInboundStation = inboundStation;
        computedOutboundStation = outbound.station;
      }
    } else {
      if (inboundStation?.groupId !== station?.groupId) {
        computedInboundStation = inboundStation;
      }
      if (outboundStation?.groupId !== station?.groupId) {
        computedOutboundStation = outboundStation;
      }
    }

    setBounds([computedInboundStation, computedOutboundStation]);
  }, [selectedLine, station, stations]);

  return bounds;
};

export default useBounds;
