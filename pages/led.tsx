import { useAtomValue } from "jotai";
import { stationAtom } from "../atoms/station";
import Container from "../components/Container";
import HorizontalSpacer from "../components/HorizontalSpacer";
import MainMarquee from "../components/MainMarquee";
import MainTopText from "../components/MainTopText";
import useCurrentLanguageState from "../hooks/useCurrentLanguageState";
import useCurrentLine from "../hooks/useCurrentLine";
import useNextStations from "../hooks/useNextStations";
import useProcessLocation from "../hooks/useProcessLocation";
import useWatchClosestStation from "../hooks/useWatchClosestStation";

const LEDPage = () => {
  const { station, stations } = useAtomValue(stationAtom);
  const currentLine = useCurrentLine();
  const nextStations = useNextStations(stations, station, currentLine);
  const langState = useCurrentLanguageState();

  useProcessLocation();
  useWatchClosestStation();

  if (!currentLine) {
    return null;
  }

  return (
    <Container fullHeight>
      <MainTopText nextStation={nextStations[1]} language={langState} />
      <HorizontalSpacer />
      <MainMarquee
        nextStation={nextStations[1]}
        afterNextStation={nextStations[2]}
        line={currentLine}
      />
    </Container>
  );
};

export default LEDPage;
