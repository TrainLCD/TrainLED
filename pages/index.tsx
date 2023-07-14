import { useAtom } from "jotai";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
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
import { Line, Station } from "../models/grpc";

const Container = styled.main`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  user-select: none;
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
  const [{ station, stations }, setStationAtom] = useAtom(stationAtom);
  const [{ selectedLine }, setLineAtom] = useAtom(lineAtom);
  const [selectedBound, setSelectedBound] = useState<Station | null>(null);

  const [fetchLinesLoading, hasFetchLinesError] = useNearbyStation();
  const { fetchSelectedTrainTypeStations } = useStationList();

  const bounds = useBounds(stations, station, selectedLine);

  useEffect(() => {
    if (selectedLine) {
      fetchSelectedTrainTypeStations();
    }
  }, [fetchSelectedTrainTypeStations, selectedLine]);

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

  const handleSelectLine = useCallback(
    (line: Line) => setLineAtom((prev) => ({ ...prev, selectedLine: line })),
    [setLineAtom]
  );

  if (fetchLinesLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Head>
        <title>TrainLED</title>
        <meta name="description" content="A joking navigation app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!selectedBound ? (
        <LineName>
          {selectedLine
            ? selectedLine.nameShort.replace(parenthesisRegexp, "")
            : "TrainLED"}
        </LineName>
      ) : null}
      {!selectedBound ? <LineName>{station?.name}</LineName> : null}
      {!selectedLine ? (
        <LinesPanel
          lines={station?.linesList || []}
          onSelect={handleSelectLine}
        />
      ) : null}
      {selectedLine && !selectedBound && bounds ? (
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
            nextStation={nextStations[1]}
            afterNextStation={nextStations[2]}
            line={selectedLine}
          />
        </>
      ) : null}
      {!selectedBound ? (
        <>
          <CautionText>※TrainLEDはβ版です。</CautionText>
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
