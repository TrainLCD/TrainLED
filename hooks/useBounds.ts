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
  bounds: { inbound: Station[]; outbound: Station[] };
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

  const bounds = useMemo((): { inbound: Station[]; outbound: Station[] } => {
    const inboundStation = stations[stations.length - 1];
    const outboundStation = stations[0];

    if (isLoopLine && !selectedTrainType) {
      return {
        inbound: inboundStationsForLoopLine,
        outbound: outboundStationsForLoopLine,
      };
    }

    if (
      inboundStation?.groupId !== currentStation?.groupId ||
      outboundStation?.groupId !== currentStation?.groupId
    ) {
      return {
        inbound: [inboundStation],
        outbound: [outboundStation],
      };
    }

    return { inbound: [], outbound: [] };
  }, [
    currentStation?.groupId,
    inboundStationsForLoopLine,
    isLoopLine,
    outboundStationsForLoopLine,
    selectedTrainType,
    stations,
  ]);

  const boundText = useMemo(() => {
    if (!selectedDirection) {
      return { en: "", ja: "" };
    }

    const switchedBounds =
      selectedDirection === "INBOUND" ? bounds.inbound : bounds.outbound;
    const jaText = switchedBounds
      .filter((station) => station)
      .map((station) => station.name.replace(parenthesisRegexp, ""))
      .join("・");
    const enText = switchedBounds
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
  }, [
    bounds.inbound,
    bounds.outbound,
    currentLine,
    selectedDirection,
    selectedTrainType,
  ]);

  return { bounds, boundText };
};

export default useBounds;
