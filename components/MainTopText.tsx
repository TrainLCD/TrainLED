// 対処法が今のところないので一旦無視する
/* eslint-disable react/jsx-key */
import styled from "styled-components";
import { LanguageState } from "../hooks/useCurrentLanguageState";
import type { Station } from "../models/grpc";

const Container = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  mask: radial-gradient(1px, #fff 100%, transparent 100%) 0 0/2px 2px;
`;

const TextContainer = styled.div<{ arrived?: boolean }>`
  display: flex;
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const GreenText = styled.p`
  width: 100%;
  max-width: 22.5%;
  color: green;
  font-size: 5vw;
`;

const OrangeTextContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const OrangeText = styled.p`
  color: orange;
  margin: 0;
  flex: 1;
  font-size: 7.5vw;
  white-space: pre-wrap;
`;

type Props = {
  bound: Station;
  currentStation: Station | null;
  nextStation: Station | null;
  arrived: boolean;
  approaching: boolean;
  language: LanguageState;
};
type SwitchedStationTextProps = {
  arrived: boolean;
  approaching: boolean;
  currentStation: Station | null;
  nextStation: Station | null;
  language: LanguageState;
};

const SwitchedStationText = ({
  arrived,
  approaching,
  currentStation,
  nextStation,
  language,
}: SwitchedStationTextProps) => {
  if (approaching && nextStation) {
    return (
      <TextContainer>
        {language === "ja" ? (
          <>
            <GreenText>まもなく</GreenText>
            <OrangeTextContainer>
              {nextStation.name.split("").map((c) => (
                <OrangeText>{c}</OrangeText>
              ))}
            </OrangeTextContainer>
          </>
        ) : null}
        {language === "jaKana" ? (
          <>
            <GreenText>まもなく</GreenText>
            <OrangeTextContainer>
              {nextStation.nameKatakana.split("").map((c) => (
                <OrangeText>{c}</OrangeText>
              ))}
            </OrangeTextContainer>
          </>
        ) : null}
        {language === "en" ? (
          <>
            <GreenText>Soon</GreenText>
            <OrangeText>
              {nextStation.nameRoman}
              {nextStation.stationNumbersList.length
                ? `\n(${nextStation.stationNumbersList[0]?.stationNumber})`
                : ""}
            </OrangeText>
          </>
        ) : null}
      </TextContainer>
    );
  }

  if (arrived && currentStation) {
    return (
      <TextContainer arrived>
        {language === "ja" ? (
          <OrangeTextContainer>
            {currentStation.name.split("").map((c) => (
              <OrangeText>{c}</OrangeText>
            ))}
          </OrangeTextContainer>
        ) : null}
        {language === "jaKana" ? (
          <OrangeTextContainer>
            {currentStation.nameKatakana.split("").map((c) => (
              <OrangeText>{c}</OrangeText>
            ))}
          </OrangeTextContainer>
        ) : null}
        {language === "en" ? (
          <OrangeTextContainer>
            <OrangeText>
              {currentStation.nameRoman}
              {currentStation.stationNumbersList.length
                ? `\n(${currentStation.stationNumbersList[0]?.stationNumber})`
                : ""}
            </OrangeText>
          </OrangeTextContainer>
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
          <OrangeTextContainer>
            {nextStation.name.split("").map((c) => (
              <OrangeText>{c}</OrangeText>
            ))}
          </OrangeTextContainer>
        </>
      ) : null}
      {language === "jaKana" ? (
        <>
          <GreenText>次は</GreenText>
          <OrangeTextContainer>
            {nextStation.nameKatakana.split("").map((c) => (
              <OrangeText>{c}</OrangeText>
            ))}
          </OrangeTextContainer>
        </>
      ) : null}
      {language === "en" ? (
        <>
          <GreenText>Next</GreenText>
          <OrangeTextContainer>
            <OrangeText>
              {nextStation.nameRoman}
              {nextStation.stationNumbersList.length
                ? `(${nextStation.stationNumbersList[0]?.stationNumber})`
                : ""}
            </OrangeText>
          </OrangeTextContainer>
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
