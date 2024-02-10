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
import Heading from "../components/Heading";
import LinesPanel from "../components/LinesPanel";
import Loading from "../components/Loading";
import { Line } from "../generated/proto/stationapi_pb";
import useUpdateNearbyStation from "../hooks/useUpdateNearbyStation";

const SearchStationButtonContainer = styled.div<{ padTop?: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const StyledHeading = styled(Heading)`
  margin: 32px 0 0 0;
`;

const HomePage = () => {
  const { station } = useAtomValue(stationAtom);
  const setLineAtom = useSetAtom(lineAtom);

  const { isLoading, error, update } = useUpdateNearbyStation();

  const router = useRouter();

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
      {isLoading && <Loading />}
      <LinesPanel lines={station?.lines ?? []} onSelect={handleSelectLine} />
      {error && (
        <StyledHeading>
          駅情報取得に失敗しました。周囲の環境や電波状況をご確認ください。
        </StyledHeading>
      )}
      <SearchStationButtonContainer>
        <Button onClick={handleSearchStationClick}>駅を指定</Button>
      </SearchStationButtonContainer>
      <SearchStationButtonContainer>
        <Button onClick={update} disabled={isLoading}>
          位置情報を更新
        </Button>
      </SearchStationButtonContainer>
      <CommonFooter />
    </Container>
  );
};

export default HomePage;
