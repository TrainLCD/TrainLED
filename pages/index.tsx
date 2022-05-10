import Head from "next/head";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BoundsPanel from "../components/BoundsPanel";
import LinesPanel from "../components/LinesPanel";
import Loading from "../components/Loading";
import MainMarquee from "../components/MainMarquee";
import useBounds from "../hooks/useBounds";
import useNearbyStation from "../hooks/useNearbyStation";
import useRefreshNextStations from "../hooks/useRefreshNextStations";
import useStationList from "../hooks/useStationList";
import { Line, Station } from "../models/StationAPI";

const Container = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  text-align: center;
`;

const LineName = styled.h2`
  line-height: 1.5;
  margin: 0;
`;
const CautionText = styled.p`
  line-height: 1.5;
`;

export default function Home() {
  const [selectedLine, setSelectedLine] = useState<Line>();
  const [selectedBound, setSelectedBound] = useState<Station | null>();

  const [station, fetchLinesLoading, hasFetchLinesError] = useNearbyStation();
  const [stations, fetchStations, fetchStationsLoading, hasFetchStationsError] =
    useStationList();
  const bounds = useBounds(stations, station, selectedLine);

  const nextStations = useRefreshNextStations(
    stations,
    station,
    selectedLine,
    selectedBound
  );

  useEffect(() => {
    if (selectedLine) {
      fetchStations(selectedLine.id);
    }
  }, [fetchStations, selectedLine]);

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
        <LineName>{selectedLine.name}</LineName>
      ) : null}
      {!selectedBound ? <LineName>{station?.name}</LineName> : null}
      {!selectedLine ? (
        <LinesPanel lines={station?.lines || []} onSelect={setSelectedLine} />
      ) : null}
      {!selectedBound ? (
        <BoundsPanel bounds={bounds} onSelect={setSelectedBound} />
      ) : null}
      {selectedBound ? (
        <MainMarquee bound={selectedBound} nextStations={nextStations} />
      ) : null}
      {!selectedBound ? (
        <CautionText>
          ※このアプリはβ版です。現在の実装では移動しても駅は更新されません。
        </CautionText>
      ) : null}
    </Container>
  );
}
