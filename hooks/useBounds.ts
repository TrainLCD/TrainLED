import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import type { Station } from "../models/grpc";
import getCurrentStationIndex from "../utils/currentStationIndex";
import {
  inboundStationsForLoopLine,
  isMeijoLine,
  isOsakaLoopLine,
  isYamanoteLine,
  outboundStationsForLoopLine,
} from "../utils/loopLine";
import { findBranchLine, findLocalType } from "../utils/trainTypeString";

const useBounds = (): {
  bounds: [Station[], Station[]];
  withTrainTypes: boolean;
} => {
  const [yamanoteLine, setYamanoteLine] = useState(false);
  const [osakaLoopLine, setOsakaLoopLine] = useState(false);
  const [meijoLine, setMeijoLine] = useState(false);

  const [bounds, setBounds] = useState<[Station[], Station[]]>([[], []]);
  const { station, stations } = useAtomValue(stationAtom);
  const { selectedLine } = useAtomValue(lineAtom);
  const { fetchedTrainTypes, trainType } = useAtomValue(trainTypeAtom);

  const localType = useMemo(
    () => findLocalType(fetchedTrainTypes),
    [fetchedTrainTypes]
  );

  // 環状路線フラグの更新
  useEffect(() => {
    if (selectedLine) {
      setYamanoteLine(isYamanoteLine(selectedLine?.id));
      setOsakaLoopLine(!trainType && isOsakaLoopLine(selectedLine?.id));
      setMeijoLine(isMeijoLine(selectedLine.id));
    }
  }, [selectedLine, trainType]);

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
    () => getCurrentStationIndex(stations, station),
    [station, stations]
  );

  const inboundStations = useMemo(
    () =>
      inboundStationsForLoopLine(
        stations,
        stations[currentIndex],
        selectedLine
      ),
    [currentIndex, selectedLine, stations]
  );
  const outboundStations = useMemo(
    () =>
      outboundStationsForLoopLine(
        stations,
        stations[currentIndex],
        selectedLine
      ),
    [currentIndex, selectedLine, stations]
  );
  useEffect(() => {
    const inboundStations = inboundStationsForLoopLine(
      stations,
      stations[currentIndex],
      selectedLine
    );
    const outboundStations = outboundStationsForLoopLine(
      stations,
      stations[currentIndex],
      selectedLine
    );

    const inboundStation = stations[stations.length - 1];
    const outboundStation = stations[0];

    let computedInboundStation: Station[] = [];
    let computedOutboundStation: Station[] = [];

    if (yamanoteLine || meijoLine || (osakaLoopLine && !trainType)) {
      computedInboundStation = inboundStations;
      computedOutboundStation = outboundStations;
    } else {
      if (inboundStation?.groupId !== station?.groupId) {
        computedInboundStation = [inboundStation];
      }
      if (outboundStation?.groupId !== station?.groupId) {
        computedOutboundStation = [outboundStation];
      }
    }

    setBounds([computedInboundStation, computedOutboundStation]);
  }, [
    currentIndex,
    inboundStations,
    meijoLine,
    osakaLoopLine,
    outboundStations,
    selectedLine,
    station?.groupId,
    stations,
    trainType,
    yamanoteLine,
  ]);

  return { bounds, withTrainTypes };
};

export default useBounds;
