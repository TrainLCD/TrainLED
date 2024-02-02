import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import Container from "../components/Container";
import HorizontalSpacer from "../components/HorizontalSpacer";
import MainMarquee from "../components/MainMarquee";
import MainTopText from "../components/MainTopText";
import useAutoMode from "../hooks/useAutoMode";
import useCurrentLanguageState from "../hooks/useCurrentLanguageState";
import useCurrentLine from "../hooks/useCurrentLine";
import useNextStations from "../hooks/useNextStations";
import useProcessLocation from "../hooks/useProcessLocation";

const LEDPage = () => {
  const { station, stations } = useAtomValue(stationAtom);
  const { autoModeEnabled } = useAtomValue(navigationAtom);

  const currentLine = useCurrentLine();
  const [, nextStation, afterNextStation] = useNextStations(
    stations,
    station,
    currentLine
  );
  const langState = useCurrentLanguageState();
  const router = useRouter();

  useProcessLocation();
  useAutoMode(autoModeEnabled);

  useEffect(() => {
    if (!currentLine) {
      router.replace("/");
    }
  }, [currentLine, router]);

  if (!currentLine) {
    return null;
  }

  return (
    <Container fullHeight>
      <MainTopText nextStation={nextStation} language={langState} />
      <HorizontalSpacer />
      <MainMarquee
        nextStation={nextStation}
        afterNextStation={afterNextStation}
        line={currentLine}
      />
    </Container>
  );
};

export default LEDPage;
