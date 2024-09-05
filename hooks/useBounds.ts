import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import {
  PARENTHESIS_REGEXP,
  TOEI_OEDO_LINE_ID,
  TOEI_OEDO_LINE_MAJOR_STATIONS_ID,
} from "../constants";
import { Station } from "../generated/proto/stationapi_pb";
import { getIsLoopLine } from "../utils/loopLine";
import { useCurrentLine } from "./useCurrentLine";
import { useCurrentStation } from "./useCurrentStation";
import useCurrentTrainType from "./useCurrentTrainType";
import { useLoopLine } from "./useLoopLine";

const useBounds = (): {
  bounds: [Station[], Station[]];
  directionalStops: Station[];
  boundText: { ja: string; en: string };
} => {
  const { stations, selectedBound } = useAtomValue(stationAtom);
  const { selectedDirection } = useAtomValue(lineAtom);
  const trainType = useCurrentTrainType();
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

    if (TOEI_OEDO_LINE_ID === currentLine?.id) {
      const stationIndex = stations.findIndex(
        (s) => s.groupId === currentStation?.groupId
      );
      const oedoLineInboundStops = stations
        .slice(stationIndex - 1, stations.length)
        .filter(
          (s) =>
            s.groupId !== currentStation?.groupId &&
            TOEI_OEDO_LINE_MAJOR_STATIONS_ID.includes(s.id)
        );
      const oedoLineOutboundStops = stations
        .slice(0, stationIndex - 1)
        .reverse()
        .filter(
          (s) =>
            s.groupId !== currentStation?.groupId &&
            TOEI_OEDO_LINE_MAJOR_STATIONS_ID.includes(s.id)
        );

      return [oedoLineInboundStops, oedoLineOutboundStops];
    }

    if (isLoopLine && !trainType) {
      return [inboundStationsForLoopLine, outboundStationsForLoopLine];
    }

    if (
      inboundStation?.groupId !== currentStation?.groupId &&
      outboundStation?.groupId !== currentStation?.groupId
    ) {
      return [[inboundStation], [outboundStation]];
    }

    if (inboundStation?.groupId !== currentStation?.groupId) {
      return [[inboundStation], []];
    }

    if (outboundStation?.groupId !== currentStation?.groupId) {
      return [[], [outboundStation]];
    }

    return [[], []];
  }, [
    currentLine?.id,
    currentStation?.groupId,
    inboundStationsForLoopLine,
    isLoopLine,
    outboundStationsForLoopLine,
    stations,
    trainType,
  ]);

  const boundText = useMemo(() => {
    if (!selectedDirection) {
      return { en: "", ja: "" };
    }

    const switchedBounds =
      selectedDirection === "INBOUND" ? bounds[0] : bounds[1];
    const jaText = switchedBounds
      .filter((station) => station)
      .map((station) => station.name.replace(PARENTHESIS_REGEXP, ""))
      .join("・");
    const enText = switchedBounds
      .filter((station) => station)
      .map(
        (station) =>
          `${station.nameRoman?.replace(PARENTHESIS_REGEXP, "")}${
            station.stationNumbers[0]?.stationNumber
              ? `(${station.stationNumbers[0]?.stationNumber})`
              : ""
          }`
      )
      .join(" and ");
    return {
      ja: `${jaText}${getIsLoopLine(currentLine, trainType) ? "方面" : ""}`,
      en: enText,
    };
  }, [bounds, currentLine, selectedDirection, trainType]);

  const directionalStops = useMemo(() => {
    const slicedBounds = bounds[selectedDirection === "INBOUND" ? 0 : 1]
      .filter((s) => !!s)
      .slice(0, 2);
    if (selectedBound && !slicedBounds.length) {
      return [selectedBound];
    }
    return slicedBounds;
  }, [bounds, selectedBound, selectedDirection]);

  return { bounds, directionalStops, boundText };
};

export default useBounds;
