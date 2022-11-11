// 対処法が今のところないので一旦無視する
/* eslint-disable react/jsx-key */
import styled from "styled-components";
import media from "styled-media-query";
import { LanguageState } from "../hooks/useCurrentLanguageState";
import type { Station } from "../models/StationAPI";

const Container = styled.div`
  display: flex;
  align-items: center;
  ${media.between("small", "medium")`
    flex: 1;
  `}
  ${media.between("medium", "large")`
    flex: 0.75;
  `}
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  mask: radial-gradient(1px, #fff 100%, transparent 100%) 0 0/2px 2px;
`;

const TextContainer = styled.div<{ arrived?: boolean }>`
  display: flex;
  font-size: 4rem;
  width: 100%;
  height: 100%;
  text-align: center;
  align-items: flex-end;
`;

const GreenText = styled.span<{ small?: boolean }>`
  color: green;
  width: ${({ small }) => (small ? "15%" : "25%")};
  font-size: ${({ small }) => (small ? "3rem" : "4rem")};
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
          <OrangeTextContainer>
            {currentStation.name.split("").map((c) => (
              <OrangeText>{c}</OrangeText>
            ))}
          </OrangeTextContainer>
        ) : null}
        {language === "jaKana" ? (
          <OrangeTextContainer>
            {currentStation.nameK.split("").map((c) => (
              <OrangeText>{c}</OrangeText>
            ))}
          </OrangeTextContainer>
        ) : null}
        {language === "en" ? (
          <OrangeTextContainer>
            <OrangeText>
              {currentStation.nameR}
              {currentStation.stationNumbers.length
                ? `(${currentStation.stationNumbers[0]?.stationNumber})`
                : ""}
            </OrangeText>
          </OrangeTextContainer>
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
              {nextStation.nameK.split("").map((c) => (
                <OrangeText>{c}</OrangeText>
              ))}
            </OrangeTextContainer>
          </>
        ) : null}
        {language === "en" ? (
          <>
            <GreenText small>Soon</GreenText>
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
          <OrangeTextContainer>
            {nextStation.name.split("").map((c) => (
              <OrangeText>{c}</OrangeText>
            ))}
          </OrangeTextContainer>
        </>
      ) : null}
      {language === "jaKana" ? (
        <>
          <GreenText small>次は</GreenText>
          <OrangeTextContainer>
            {nextStation.nameK.split("").map((c) => (
              <OrangeText>{c}</OrangeText>
            ))}
          </OrangeTextContainer>
        </>
      ) : null}
      {language === "en" ? (
        <>
          <GreenText small>Next</GreenText>
          <OrangeTextContainer>
            <OrangeText>
              {nextStation.nameR}
              {nextStation.stationNumbers.length
                ? `(${nextStation.stationNumbers[0]?.stationNumber})`
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
