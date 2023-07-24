import { useAtomValue } from "jotai";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { parenthesisRegexp } from "../constants/regexp";
import Heading from "./Heading";

const CommonHeader = () => {
  const { station } = useAtomValue(stationAtom);
  const { selectedLine } = useAtomValue(lineAtom);

  return (
    <>
      <Heading>
        {selectedLine
          ? selectedLine.nameShort.replace(parenthesisRegexp, "")
          : "TrainLED"}
      </Heading>
      <Heading>{station?.name ?? ""}</Heading>
    </>
  );
};

export default CommonHeader;
