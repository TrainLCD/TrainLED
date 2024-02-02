import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import { parenthesisRegexp } from "../constants/regexp";
import { Station } from "../generated/proto/stationapi_pb";
import { getIsLoopLine } from "../utils/loopLine";
import useCurrentLine from "./useCurrentLine";
import useCurrentStation from "./useCurrentStation";
import { useLoopLine } from "./useLoopLine";

const useBounds = (): {
  bounds: [Station[], Station[]];
  boundText: { en: string; ja: string };
} => {
  const { stations } = useAtomValue(stationAtom);
  const { selectedDirection } = useAtomValue(lineAtom);
  const { selectedTrainType } = useAtomValue(trainTypeAtom);

  const currentStation = useCurrentStation();
  const currentLine = useCurrentLine();

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

  const boundText = useMemo(() => {
    const index = selectedDirection === "INBOUND" ? 0 : 1;
    const jaText = bounds[index]
      .filter((station) => station)
      .map((station) => station.name.replace(parenthesisRegexp, ""))
      .join("・");
    const enText = bounds[index]
      .filter((station) => station)
      .map(
        (station) =>
          `${station.nameRoman?.replace(parenthesisRegexp, "")}${
            station.stationNumbers[0]?.stationNumber
              ? `(${station.stationNumbers[0]?.stationNumber})`
              : ""
          }`
      )
      .join(" and ");
    return {
      ja: `${jaText}${
        getIsLoopLine(currentLine, selectedTrainType) ? "方面" : ""
      }`,
      en: enText,
    };
  }, [bounds, currentLine, selectedDirection, selectedTrainType]);

  return { bounds, boundText };
};

export default useBounds;
