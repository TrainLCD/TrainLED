import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Head from "next/head";
import {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import { lineAtom } from "../atoms/line";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import BoundsPanel from "../components/BoundsPanel";
import Button from "../components/Button";
import Container from "../components/Container";
import Heading from "../components/Heading";
import HorizontalSpacer from "../components/HorizontalSpacer";
import LinesPanel from "../components/LinesPanel";
import Loading from "../components/Loading";
import MainMarquee from "../components/MainMarquee";
import MainTopText from "../components/MainTopText";
import { parenthesisRegexp } from "../constants/regexp";
import useCurrentLanguageState from "../hooks/useCurrentLanguageState";
import useFetchNearbyStation from "../hooks/useFetchNearbyStation";
import useNextStations from "../hooks/useNextStations";
import useSearchStation from "../hooks/useSearchStation";
import useStationList from "../hooks/useStationList";
import useUpdateClosestStationOnce from "../hooks/useUpdateClosestStationOnce";
import useWakeLock from "../hooks/useWakeLock";
import useWatchClosestStation from "../hooks/useWatchClosestStation";
import StationForSearch from "../models/StationForSearch";
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

const SearchStationButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
`;

const StationNameInput = styled.input`
  appearance: none;
  border: 1px solid#fff;
  background: none;
  color: white;
  padding: 12px;
  font-size: 1rem;
  font-family: "JF-Dot-jiskan24";
  width: 320px;
  border-radius: 0;

  ::placeholder {
    opacity: 0.5;
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;

const SearchResultListContainer = styled.ul`
  width: 320px;
  list-style-type: none;
  padding: 0;
  border: 1px solid #fff;
  height: 320px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const SearchResultListContent = styled.li<{ centering?: boolean }>`
  padding: 12px;
  border-bottom: 1px solid #fff;
  text-align: ${({ centering }) => (centering ? "center" : "left")};
`;

const LineScene = () => {
  const { station } = useAtomValue(stationAtom);
  const setLineAtom = useSetAtom(lineAtom);
  const setNavigationAtom = useSetAtom(navigationAtom);
  const [fetchLinesLoading] = useFetchNearbyStation();

  const { update: updateCurrentStationOnce } = useUpdateClosestStationOnce();

  useEffect(() => {
    updateCurrentStationOnce();
  }, [updateCurrentStationOnce]);

  const handleSelectLine = useCallback(
    (line: Line) => {
      setLineAtom((prev) => ({ ...prev, selectedLine: line }));
    },
    [setLineAtom]
  );

  const handleSearchStationClick = useCallback(
    () =>
      setNavigationAtom((prev) => ({
        ...prev,
        scene: "SEARCH",
      })),
    [setNavigationAtom]
  );

  return (
    <>
      {fetchLinesLoading && <Loading />}
      <LinesPanel
        lines={station?.linesList ?? []}
        onSelect={handleSelectLine}
      />
      <SearchStationButtonContainer>
        <Button onClick={handleSearchStationClick}>駅を指定</Button>
      </SearchStationButtonContainer>
    </>
  );
};

const SearchScene = () => {
  const { search } = useSearchStation();
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<StationForSearch[]>([]);
  const [alreadySearched, setAlreadySearched] = useState(false);

  const setStationAtom = useSetAtom(stationAtom);
  const setNavigationAtom = useSetAtom(navigationAtom);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value),
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const result = await search(query);
      if (result) {
        setSearchResult(result);
      }
      setAlreadySearched(true);
    },
    [query, search]
  );

  const handleStationClick = useCallback(
    (station: StationForSearch) => {
      const { nameForSearch, ...reducedStation } = station;
      setSearchResult([]);
      setQuery("");

      setStationAtom((prev) => ({
        ...prev,
        station: reducedStation,
      }));
      setNavigationAtom((prev) => ({ ...prev, scene: "LINE" }));
    },
    [setNavigationAtom, setStationAtom]
  );

  return (
    <Container fullHeight>
      <Heading>駅を指定</Heading>
      <SearchForm onSubmit={handleSubmit}>
        <StationNameInput
          onChange={handleChange}
          placeholder="実は入力できるんすよ"
        />
        <SearchResultListContainer>
          {!searchResult.length && query.length === 0 && !alreadySearched && (
            <SearchResultListContent centering>
              駅名を入力してください
            </SearchResultListContent>
          )}{" "}
          {!searchResult.length && alreadySearched && (
            <SearchResultListContent centering>
              結果がないゾイ
            </SearchResultListContent>
          )}
          {searchResult.map((station) => (
            <SearchResultListContent
              onClick={handleStationClick.bind(this, station)}
              key={station.id}
            >
              {station.nameForSearch}
            </SearchResultListContent>
          ))}
        </SearchResultListContainer>
      </SearchForm>
    </Container>
  );
};

const BoundScene = () => {
  const setTrainTypeAtom = useSetAtom(trainTypeAtom);
  const [{ station }, setStationAtom] = useAtom(stationAtom);
  const setLineAtom = useSetAtom(lineAtom);
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
  const nextStations = useNextStations(stations, station, selectedLine);
  const langState = useCurrentLanguageState();

  const locationUpdatePaused = useMemo(() => !selectedBound, [selectedBound]);

  useWatchClosestStation(locationUpdatePaused);

  if (!selectedLine) {
    return null;
  }

  return (
    <Container fullHeight>
      <MainTopText nextStation={nextStations[1]} language={langState} />
      <HorizontalSpacer />
      <MainMarquee
        nextStation={nextStations[1]}
        afterNextStation={nextStations[2]}
        line={selectedLine}
      />
    </Container>
  );
};

const Home = () => {
  const { station, selectedBound } = useAtomValue(stationAtom);
  const { selectedLine } = useAtomValue(lineAtom);
  const [{ scene }, setNavigationAtom] = useAtom(navigationAtom);

  useEffect(() => {
    if (selectedLine && selectedBound) {
      setNavigationAtom((prev) => ({ ...prev, scene: "LED" }));
      return;
    }
    if (!selectedLine) {
      setNavigationAtom((prev) => ({ ...prev, scene: "LINE" }));
      return;
    }
    if (selectedLine && !selectedBound) {
      setNavigationAtom((prev) => ({ ...prev, scene: "BOUND" }));
      return;
    }
  }, [selectedBound, selectedLine, setNavigationAtom]);

  const Scene = useMemo(() => {
    switch (scene) {
      case "LINE":
        return LineScene;
      case "SEARCH":
        return SearchScene;
      case "BOUND":
        return BoundScene;
      case "LED":
        return LEDScene;
      default:
        return LineScene;
    }
  }, [scene]);

  return (
    <Container fullHeight>
      <Head>
        <title>TrainLED</title>
        <meta name="description" content="A joking navigation app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {scene !== "LED" && scene !== "SEARCH" && (
        <>
          <Heading>
            {selectedLine
              ? selectedLine.nameShort.replace(parenthesisRegexp, "")
              : "TrainLED"}
          </Heading>
          <Heading>{station?.name ?? ""}</Heading>
        </>
      )}

      <Scene />

      {scene !== "LED" && scene !== "SEARCH" && (
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
