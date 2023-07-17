import { useAtom, useSetAtom } from "jotai";
import Head from "next/head";
import { memo, useCallback, useEffect } from "react";
import styled from "styled-components";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import BoundsPanel from "../components/BoundsPanel";
import LinesPanel from "../components/LinesPanel";
import Loading from "../components/Loading";
import MainMarquee from "../components/MainMarquee";
import MainTopText from "../components/MainTopText";
import { parenthesisRegexp } from "../constants/regexp";
import useBounds from "../hooks/useBounds";
import useClosestStation from "../hooks/useClosestStation";
import useCurrentLanguageState from "../hooks/useCurrentLanguageState";
import useFetchNearbyStation from "../hooks/useFetchNearbyStation";
import useNextStations from "../hooks/useNextStations";
import useStationList from "../hooks/useStationList";
import useWakeLock from "../hooks/useWakeLock";
import { Line, Station, TrainType } from "../models/grpc";

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

const CreditContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const TrainLCDLink = styled.a`
  line-height: 1.5;
  text-align: center;
`;

const Home = () => {
  const [{ station, stations, selectedBound }, setStationAtom] =
    useAtom(stationAtom);
  const [{ selectedLine }, setLineAtom] = useAtom(lineAtom);
  const setTrainTypeAtom = useSetAtom(trainTypeAtom);

  const [fetchLinesLoading, hasFetchLinesError] = useFetchNearbyStation();
  const { fetchSelectedTrainTypeStations, loading: fetchStationsLoading } =
    useStationList();

  const { bounds } = useBounds();

  const requestWakeLock = useWakeLock();

  useEffect(() => {
    fetchSelectedTrainTypeStations();
  }, [fetchSelectedTrainTypeStations]);

  const { arrived, approaching, newStation } = useClosestStation(
    station,
    selectedBound,
    stations,
    selectedLine
  );

  const nextStations = useNextStations(stations, newStation, selectedLine);

  const langState = useCurrentLanguageState();

  const handleSelectLine = useCallback(
    (line: Line) => setLineAtom((prev) => ({ ...prev, selectedLine: line })),
    [setLineAtom]
  );

  const handleSelectedBound = useCallback(
    async (selectedBound: Station, index: number) => {
      setStationAtom((prev) => ({ ...prev, selectedBound }));
      setLineAtom((prev) => ({
        ...prev,
        selectedDirection: !index ? "INBOUND" : "OUTBOUND",
      }));

      requestWakeLock();
    },
    [requestWakeLock, setLineAtom, setStationAtom]
  );

  const clearSelectedLine = useCallback(() => {
    setTrainTypeAtom((prev) => ({
      ...prev,
      trainType: null,
      fetchedTrainTypes: [],
    }));
    setStationAtom((prev) => ({ ...prev, stations: [] }));
    setLineAtom((prev) => ({ ...prev, selectedLine: null }));
  }, [setLineAtom, setStationAtom, setTrainTypeAtom]);

  const handleTrainTypeSelect = useCallback(
    (trainType: TrainType) => {
      if (trainType.id === 0) {
        setTrainTypeAtom((prev) => ({
          ...prev,
          trainType: null,
        }));
        return;
      }

      setTrainTypeAtom((prev) => ({
        ...prev,
        trainType,
      }));
    },
    [setTrainTypeAtom]
  );

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
      {(fetchLinesLoading || fetchStationsLoading) && <Loading />}
      {!selectedBound && station ? <LineName>{station.name}</LineName> : null}
      {!selectedLine && station ? (
        <LinesPanel lines={station.linesList} onSelect={handleSelectLine} />
      ) : null}
      {selectedLine && !selectedBound ? (
        <BoundsPanel
          onBack={clearSelectedLine}
          stationGroupList={bounds}
          onSelect={handleSelectedBound}
          onTrainTypeSelect={handleTrainTypeSelect}
        />
      ) : null}
      {selectedBound && selectedLine ? (
        <>
          <MainTopText
            arrived={arrived}
            approaching={approaching}
            currentStation={newStation}
            nextStation={nextStations[1]}
            language={langState}
          />
          <HorizontalSpacer />
          <MainMarquee
            arrived={arrived}
            approaching={approaching}
            nextStation={nextStations[1]}
            afterNextStation={nextStations[2]}
            line={selectedLine}
          />
        </>
      ) : null}
      {!selectedBound ? (
        <CreditContainer>
          <CautionText>※TrainLEDはβ版です。</CautionText>
          <TrainLCDLink
            href="https://trainlcd.app/"
            rel="noopener noreferrer"
            target="_blank"
          >
            TrainLCDアプリをダウンロード
          </TrainLCDLink>
        </CreditContainer>
      ) : null}
    </Container>
  );
};

export default memo(Home);
