import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import { Station } from "../generated/proto/stationapi_pb";
import useCurrentStation from "./useCurrentStation";
import { useLoopLine } from "./useLoopLine";

const useBounds = (): {
  bounds: [Station[], Station[]];
} => {
  const { stations } = useAtomValue(stationAtom);
  const { selectedTrainType } = useAtomValue(trainTypeAtom);
  const currentStation = useCurrentStation();

  const {
    isLoopLine,
    inboundStationsForLoopLine,
    outboundStationsForLoopLine,
  } = useLoopLine();

  const bounds = useMemo((): [Station[], Station[]] => {
    const inboundStation = stations[stations.length - 1];
    const outboundStation = stations[0];

    if (isLoopLine && !selectedTrainType) {
      return [inboundStationsForLoopLine, outboundStationsForLoopLine];
    }

    if (
      inboundStation?.groupId !== currentStation?.groupId ||
      outboundStation?.groupId !== currentStation?.groupId
    ) {
      return [[inboundStation], [outboundStation]];
    }

    return [[], []];
  }, [
    currentStation?.groupId,
    inboundStationsForLoopLine,
    isLoopLine,
    outboundStationsForLoopLine,
    selectedTrainType,
    stations,
  ]);

  return { bounds };
};

export default useBounds;
