import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback } from "react";
import styled from "styled-components";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import Button from "../components/Button";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";
import Container from "../components/Container";
import LinesPanel from "../components/LinesPanel";
import Loading from "../components/Loading";
import useFetchNearbyStation from "../hooks/useFetchNearbyStation";
import useUpdateClosestStationOnce from "../hooks/useUpdateClosestStationOnce";
import { Line } from "../models/grpc";

const SearchStationButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const HomePage = () => {
  const { station } = useAtomValue(stationAtom);
  const setLineAtom = useSetAtom(lineAtom);
  const [fetchLinesLoading] = useFetchNearbyStation();

  const router = useRouter();
  useUpdateClosestStationOnce();

  const handleSelectLine = useCallback(
    (line: Line) => {
      setLineAtom((prev) => ({ ...prev, selectedLine: line }));
      router.push("/bound");
    },
    [router, setLineAtom]
  );

  const handleSearchStationClick = useCallback(
    () => router.push("/search"),
    [router]
  );
  return (
    <Container>
      <CommonHeader />
      {fetchLinesLoading && <Loading />}
      <LinesPanel
        lines={station?.linesList ?? []}
        onSelect={handleSelectLine}
      />
      <SearchStationButtonContainer>
        <Button onClick={handleSearchStationClick}>駅を指定</Button>
      </SearchStationButtonContainer>
      <CommonFooter />
    </Container>
  );
};

export default HomePage;
