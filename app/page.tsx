"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Button from "../components/Button";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";
import Container from "../components/Container";
import LinesPanel from "../components/LinesPanel";
import Loading from "../components/Loading";
import useUpdateNearbyStation from "../hooks/useUpdateNearbyStation";
import { SearchStationButtonContainer, StyledHeading } from "./page.styled";

const Page = () => {
  const { isLoading, error, update } = useUpdateNearbyStation();

  const router = useRouter();

  const handleSearchStationClick = useCallback(
    () => router.push("/search"),
    [router]
  );

  return (
    <Container>
      <CommonHeader />
      {isLoading && <Loading />}
      <LinesPanel />
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

export default Page;
