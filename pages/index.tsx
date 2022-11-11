import Head from "next/head";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BoundsPanel from "../components/BoundsPanel";
import LinesPanel from "../components/LinesPanel";
import Loading from "../components/Loading";
import MainMarquee from "../components/MainMarquee";
import MainTopText from "../components/MainTopText";
import { parenthesisRegexp } from "../constants/regexp";
import useBounds from "../hooks/useBounds";
import useClosestStation from "../hooks/useClosestStation";
import useCurrentLanguageState from "../hooks/useCurrentLanguageState";
import useNearbyStation from "../hooks/useNearbyStation";
import useNextStations from "../hooks/useNextStations";
import useStationList from "../hooks/useStationList";
import type { Line, Station } from "../models/StationAPI";

const Container = styled.main`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const LineName = styled.h2`
  line-height: 1.5;
  margin: 0;
  text-align: center;
`;
const CautionText = styled.p`
  line-height: 1.5;
  text-align: center;
`;

const HorizontalSpacer = styled.div`
  height: 5vh;
`;

const TrainLCDLink = styled.a`
  line-height: 1.5;
  margin: 0;
  text-align: center;
`;

export default function Home() {
  const [selectedLine, setSelectedLine] = useState<Line>();
  const [selectedBound, setSelectedBound] = useState<Station>();

  const [station, fetchLinesLoading, hasFetchLinesError] = useNearbyStation();
  const [stations, fetchStations, fetchStationsLoading, hasFetchStationsError] =
    useStationList();
  const bounds = useBounds(stations, station, selectedLine);

  useEffect(() => {
    if (selectedLine) {
      fetchStations(selectedLine.id);
    }
  }, [fetchStations, selectedLine]);

  const { arrived, approaching, newStation } = useClosestStation(
    station,
    selectedBound,
    stations,
    selectedLine
  );

  const nextStations = useNextStations(
    stations,
    newStation,
    selectedLine,
    selectedBound
  );

  const langState = useCurrentLanguageState();

  if (fetchLinesLoading || fetchStationsLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Head>
        <title>TrainLED</title>
        <meta name="description" content="A joking navigation app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {selectedLine && !selectedBound ? (
        <LineName>{selectedLine.name.replace(parenthesisRegexp, "")}</LineName>
      ) : null}
      {!selectedBound ? <LineName>{station?.name}</LineName> : null}
      {!selectedLine ? (
        <LinesPanel lines={station?.lines || []} onSelect={setSelectedLine} />
      ) : null}
      {selectedLine && !selectedBound ? (
        <BoundsPanel bounds={bounds} onSelect={setSelectedBound} />
      ) : null}
      {selectedBound && selectedLine ? (
        <>
          <MainTopText
            arrived={arrived}
            approaching={approaching}
            bound={selectedBound}
            currentStation={newStation}
            nextStation={nextStations[1]}
            language={langState}
          />
          <HorizontalSpacer />
          <MainMarquee
            arrived={arrived}
            approaching={approaching}
            bound={selectedBound}
            currentStation={newStation}
            nextStation={nextStations[1]}
            line={selectedLine}
          />
        </>
      ) : null}
      {!selectedBound ? (
        <>
          <CautionText>※このアプリはβ版です。</CautionText>
          <TrainLCDLink
            href="https://trainlcd.app/"
            rel="noopener noreferrer"
            target="_blank"
          >
            TrainLCDアプリをダウンロード
          </TrainLCDLink>
        </>
      ) : null}
    </Container>
  );
}
