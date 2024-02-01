import { useAtomValue } from "jotai";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import useCurrentLine from "./useCurrentLine";
import useNextStations from "./useNextStations";

export const useIsLastStop = () => {
  const { station, stations } = useAtomValue(stationAtom);
  const { arrived } = useAtomValue(navigationAtom);

  const currentLine = useCurrentLine();
  const [, nextStation, afterNextStation] = useNextStations(
    stations,
    station,
    currentLine
  );

  if (!nextStation || (nextStation && !afterNextStation && !arrived)) {
    return true;
  }

  return false;
};
