import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { stationAtom } from "../atoms/station";
import { useLoopLine } from "./useLoopLine";
import { useNextStation } from "./useNextStation";

export const useIsLastStop = (): boolean => {
  const { selectedBound } = useAtomValue(stationAtom);
  const nextStation = useNextStation();
  const { isLoopLine } = useLoopLine();

  const isNextLastStop = useMemo(() => {
    if (isLoopLine) {
      return false;
    }

    return nextStation?.groupId === selectedBound?.groupId;
  }, [isLoopLine, nextStation?.groupId, selectedBound?.groupId]);

  return isNextLastStop;
};
