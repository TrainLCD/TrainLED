import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { Line } from "../generated/proto/stationapi_pb";
import useCurrentStation from "./useCurrentStation";

const useCurrentLine = (): Line | null => {
  const { stations } = useAtomValue(stationAtom);
  const { selectedLine, selectedDirection } = useAtomValue(lineAtom);

  const currentStation = useCurrentStation();

  // 副都心線を選択しているのに次の駅到着まで東横線になるバグに対する対処
  // 副都心線に限らずデータ上直通運転が設定されているすべての駅で発生していたはず
  // UPDATE: 2023/04/09 新桜台から小竹向原駅を経由して副都心線に入る時、
  // 小竹向原に到着した時点で副都心線になるのが期待値だが、西武有楽町線のままになっている
  // このコードがあることで解決するので、消しちゃダメ
  const actualCurrentStation = useMemo(
    () =>
      (selectedDirection === "INBOUND"
        ? stations.slice().reverse()
        : stations
      ).find((rs) => rs.groupId === currentStation?.groupId && rs.line?.id),
    [currentStation?.groupId, stations, selectedDirection]
  );

  const currentLine = useMemo(
    () => actualCurrentStation?.line || selectedLine,
    [actualCurrentStation?.line, selectedLine]
  );

  return currentLine;
};

export default useCurrentLine;
