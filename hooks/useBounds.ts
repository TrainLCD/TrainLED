import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import type { Station } from "../models/grpc";
import getCurrentStationIndex from "../utils/currentStationIndex";
import {
  getIsMeijoLine,
  getIsOsakaLoopLine,
  getIsYamanoteLine,
  inboundStationsForLoopLine,
  outboundStationsForLoopLine,
} from "../utils/loopLine";
import { findBranchLine, findLocalType } from "../utils/trainTypeString";
import useCurrentLine from "./useCurrentLine";
import useCurrentStation from "./useCurrentStation";

const useBounds = (): {
  bounds: [Station[], Station[]];
  withTrainTypes: boolean;
} => {
  const [bounds, setBounds] = useState<[Station[], Station[]]>([[], []]);
  const { stations } = useAtomValue(stationAtom);
  const { fetchedTrainTypes, trainType } = useAtomValue(trainTypeAtom);

  const currentStation = useCurrentStation();
  const currentLine = useCurrentLine();

  const localType = useMemo(
    () => findLocalType(fetchedTrainTypes),
    [fetchedTrainTypes]
  );

  const yamanoteLine = useMemo(
    () => currentLine && getIsYamanoteLine(currentLine.id),
    [currentLine]
  );
  const osakaLoopLine = useMemo(
    () => currentLine && !trainType && getIsOsakaLoopLine(currentLine.id),
    [currentLine, trainType]
  );
  const meijoLine = useMemo(
    () => currentLine && getIsMeijoLine(currentLine.id),
    [currentLine]
  );

  // 種別選択ボタンを表示するかのフラグ
  const withTrainTypes = useMemo((): boolean => {
    // 種別が一つも登録されていない駅では種別選択を出来ないようにする
    if (!fetchedTrainTypes.length) {
      return false;
    }
    // 種別登録が1件のみで唯一登録されている種別が
    // 支線もしくは普通/各停の種別だけ登録されている場合は種別選択を出来ないようにする
    if (fetchedTrainTypes.length === 1) {
      const branchLineType = findBranchLine(fetchedTrainTypes);
      if (branchLineType || localType) {
        return false;
      }
    }
    return true;
  }, [fetchedTrainTypes, localType]);

  const currentIndex = useMemo(
    () => getCurrentStationIndex(stations, currentStation),
    [currentStation, stations]
  );

  const inboundStations = useMemo(
    () =>
      inboundStationsForLoopLine(stations, stations[currentIndex], currentLine),
    [currentIndex, currentLine, stations]
  );
  const outboundStations = useMemo(
    () =>
      outboundStationsForLoopLine(
        stations,
        stations[currentIndex],
        currentLine
      ),
    [currentIndex, currentLine, stations]
  );
  useEffect(() => {
    const inboundStations = inboundStationsForLoopLine(
      stations,
      stations[currentIndex],
      currentLine
    );
    const outboundStations = outboundStationsForLoopLine(
      stations,
      stations[currentIndex],
      currentLine
    );

    const inboundStation = stations[stations.length - 1];
    const outboundStation = stations[0];

    let computedInboundStation: Station[] = [];
    let computedOutboundStation: Station[] = [];

    if (yamanoteLine || meijoLine || (osakaLoopLine && !trainType)) {
      computedInboundStation = inboundStations;
      computedOutboundStation = outboundStations;
    } else {
      if (inboundStation?.groupId !== currentStation?.groupId) {
        computedInboundStation = [inboundStation];
      }
      if (outboundStation?.groupId !== currentStation?.groupId) {
        computedOutboundStation = [outboundStation];
      }
    }

    setBounds([computedInboundStation, computedOutboundStation]);
  }, [
    currentIndex,
    currentLine,
    currentStation?.groupId,
    meijoLine,
    osakaLoopLine,
    stations,
    trainType,
    yamanoteLine,
  ]);

  return { bounds, withTrainTypes };
};

export default useBounds;
