import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Head from "next/head";
import { memo, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import BoundsPanel from "../components/BoundsPanel";
import Container from "../components/Container";
import HorizontalSpacer from "../components/HorizontalSpacer";
import LineName from "../components/LineName";
import LinesPanel from "../components/LinesPanel";
import Loading from "../components/Loading";
import MainMarquee from "../components/MainMarquee";
import MainTopText from "../components/MainTopText";
import { parenthesisRegexp } from "../constants/regexp";
import useClosestStation from "../hooks/useClosestStation";
import useCurrentLanguageState from "../hooks/useCurrentLanguageState";
import useFetchNearbyStation from "../hooks/useFetchNearbyStation";
import useNextStations from "../hooks/useNextStations";
import useStationList from "../hooks/useStationList";
import useWakeLock from "../hooks/useWakeLock";
import { Line, Station, TrainType } from "../models/grpc";

const CautionText = styled.p`
  line-height: 1.5;
  text-align: center;
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

const LineScene = () => {
  const { station } = useAtomValue(stationAtom);
  const [{ selectedLine }, setLineAtom] = useAtom(lineAtom);
  const [fetchLinesLoading] = useFetchNearbyStation();

  const handleSelectLine = useCallback(
    (line: Line) => {
      setLineAtom((prev) => ({ ...prev, selectedLine: line }));
    },
    [setLineAtom]
  );

  return (
    <>
      <LineName>
        {selectedLine
          ? selectedLine.nameShort.replace(parenthesisRegexp, "")
          : "TrainLED"}
      </LineName>
      <LineName>{station?.name ?? ""}</LineName>
      {fetchLinesLoading && <Loading />}
      <LinesPanel
        lines={station?.linesList ?? []}
        onSelect={handleSelectLine}
      />
    </>
  );
};

const BoundScene = () => {
  const setTrainTypeAtom = useSetAtom(trainTypeAtom);
  const [{ station }, setStationAtom] = useAtom(stationAtom);
  const [{ selectedLine }, setLineAtom] = useAtom(lineAtom);
  const { fetchSelectedTrainTypeStations } = useStationList();

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

  const requestWakeLock = useWakeLock();

  const handleSelectedBound = useCallback(
    async (selectedBound: Station, index: number) => {
      requestWakeLock();

      setStationAtom((prev) => ({ ...prev, selectedBound }));
      setLineAtom((prev) => ({
        ...prev,
        selectedDirection: !index ? "INBOUND" : "OUTBOUND",
      }));
    },
    [requestWakeLock, setLineAtom, setStationAtom]
  );

  useEffect(() => {
    fetchSelectedTrainTypeStations();
  }, [fetchSelectedTrainTypeStations]);

  if (!station) {
    return null;
  }

  return (
    <Container>
      <LineName>
        {selectedLine && selectedLine.nameShort.replace(parenthesisRegexp, "")}
      </LineName>
      <LineName>{station?.name ?? ""}</LineName>
      <BoundsPanel
        onBack={clearSelectedLine}
        onSelect={handleSelectedBound}
        onTrainTypeSelect={handleTrainTypeSelect}
      />
    </Container>
  );
};

const LEDScene = () => {
  const { station, stations, selectedBound } = useAtomValue(stationAtom);
  const { selectedLine } = useAtomValue(lineAtom);
  const { arrived, approaching, newStation } = useClosestStation(
    station,
    selectedBound,
    stations,
    selectedLine
  );
  const nextStations = useNextStations(stations, newStation, selectedLine);
  const langState = useCurrentLanguageState();

  if (!selectedLine) {
    return null;
  }

  return (
    <Container>
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
    </Container>
  );
};

const Home = () => {
  const { selectedBound } = useAtomValue(stationAtom);
  const [{ selectedLine }, setLineAtom] = useAtom(lineAtom);

  const scene = useMemo<"LINE" | "BOUND" | "LED">(() => {
    if (selectedLine && selectedBound) {
      return "LED";
    }
    if (!selectedLine) {
      return "LINE";
    }
    if (selectedLine && !selectedBound) {
      return "BOUND";
    }

    return "LINE";
  }, [selectedBound, selectedLine]);

  const Scene = useMemo(() => {
    switch (scene) {
      case "LINE":
        return LineScene;
      case "BOUND":
        return BoundScene;
      case "LED":
        return LEDScene;
      default:
        return LineScene;
    }
  }, [scene]);

  return (
    <Container>
      <Head>
        <title>TrainLED</title>
        <meta name="description" content="A joking navigation app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Scene />

      {scene !== "LED" && (
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
      )}
    </Container>
  );
};

export default memo(Home);
