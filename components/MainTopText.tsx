import styled from "styled-components";
import { LanguageState } from "../hooks/useCurrentLanguageState";
import type { Station } from "../models/StationAPI";

const Container = styled.div`
  margin-left: 1vw;
  mask: radial-gradient(1px, #fff 100%, transparent 100%) 0 0/2px 2px;
`;

const TextContainer = styled.div<{ arrived?: boolean }>`
  font-size: 5rem;
  user-select: none;
  width: 100%;
  text-align: ${({ arrived }) => (arrived ? "center" : "left")};
`;

const GreenText = styled.span`
  color: green;
`;

const OrangeText = styled.span`
  color: orange;
`;

const Spacer = styled.div`
  width: 5vw;
`;

type Props = {
  bound: Station;
  currentStation: Station | undefined;
  nextStation: Station | undefined;
  arrived: boolean;
  approaching: boolean;
  language: LanguageState;
};
type SwitchedStationTextProps = {
  arrived: boolean;
  approaching: boolean;
  currentStation: Station | undefined;
  nextStation: Station | undefined;
  language: LanguageState;
};

const SwitchedStationText = ({
  arrived,
  approaching,
  currentStation,
  nextStation,
  language,
}: SwitchedStationTextProps) => {
  if (arrived && currentStation) {
    return (
      <TextContainer arrived>
        {language === "ja" ? (
          <OrangeText>{currentStation.name}</OrangeText>
        ) : null}
        {language === "jaKana" ? (
          <OrangeText>{currentStation.nameK}</OrangeText>
        ) : null}
        {language === "en" ? (
          <OrangeText>
            {currentStation.nameR}
            {currentStation.stationNumbers.length
              ? `(${currentStation.stationNumbers[0]?.stationNumber})`
              : ""}
          </OrangeText>
        ) : null}
      </TextContainer>
    );
  }
  if (approaching && nextStation) {
    return (
      <TextContainer>
        {language === "ja" ? (
          <>
            <GreenText>まもなく</GreenText>
            <Spacer />
            <OrangeText>{nextStation.name}</OrangeText>
          </>
        ) : null}
        {language === "jaKana" ? (
          <>
            <GreenText>まもなく</GreenText>
            <Spacer />
            <OrangeText>{nextStation.nameK}</OrangeText>
          </>
        ) : null}
        {language === "en" ? (
          <>
            <GreenText>Soon</GreenText>
            <Spacer />
            <OrangeText>
              {nextStation.nameR}
              {nextStation.stationNumbers.length
                ? `(${nextStation.stationNumbers[0]?.stationNumber})`
                : ""}
            </OrangeText>
          </>
        ) : null}
      </TextContainer>
    );
  }

  if (!nextStation) {
    return null;
  }
  return (
    <TextContainer>
      {language === "ja" ? (
        <>
          <GreenText>次は</GreenText>
          <Spacer />
          <OrangeText>{nextStation.name}</OrangeText>
        </>
      ) : null}
      {language === "jaKana" ? (
        <>
          <GreenText>次は</GreenText>
          <Spacer />
          <OrangeText>{nextStation.nameK}</OrangeText>
        </>
      ) : null}
      {language === "en" ? (
        <>
          <GreenText>Next</GreenText>
          <Spacer />
          <OrangeText>
            {nextStation.nameR}
            {nextStation.stationNumbers.length
              ? `(${nextStation.stationNumbers[0]?.stationNumber})`
              : ""}
          </OrangeText>
        </>
      ) : null}
    </TextContainer>
  );
};

const MainTopText = (props: Props) => {
  const { bound, ...rest } = props;
  return (
    <Container>
      <SwitchedStationText {...rest} />
    </Container>
  );
};

export default MainTopText;
