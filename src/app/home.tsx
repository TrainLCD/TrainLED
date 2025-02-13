'use client';
import CommonFooter from '../components/CommonFooter';
import CommonHeader from '../components/CommonHeader';
import Container from '../components/Container';
import LinesPanel from '../components/LinesPanel';
import Loading from '../components/Loading';
import useUpdateNearbyStation from '../hooks/useUpdateNearbyStation';
import {
  SearchStationAnchor,
  StyledHeading,
  UpdateButton,
} from './home.styled';

export const Home = () => {
  const { isLoading, error, update } = useUpdateNearbyStation();

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
      <SearchStationAnchor href="/search">駅を指定</SearchStationAnchor>
      <UpdateButton onClick={update} disabled={isLoading}>
        位置情報を更新
      </UpdateButton>
      <CommonFooter />
    </Container>
  );
};
