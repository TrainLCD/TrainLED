import type { Station } from "@/generated/src/proto/stationapi_pb";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import styled from "styled-components";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import type { LanguageState } from "../hooks/useCurrentLanguageState";
import { useCurrentStation } from "../hooks/useCurrentStation";

const Container = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  mask: radial-gradient(1px, #fff 100%, transparent 100%) 0 0/2px 2px;
`;

const TextContainer = styled.div`
  display: flex;
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const GreenText = styled.p<{ bound?: boolean }>`
  width: 100%;
  max-width: 22.5%;
  color: green;
  font-size: ${({ bound }) => (bound ? "7.5vw" : "5vw")};
  margin: 0;
`;

const StationInfoGroup = styled.div`
  flex: 1;
`;

const StateText = styled.p`
  width: 100%;
  max-width: 22.5%;
  color: green;
  font-size: 5vw;
  margin: 0;
`;

const OrangeTextContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const OrangeText = styled.p`
  line-height: 1.25;
  color: orange;
  margin: 0;
  flex: 1;
  font-size: 7.5vw;
  white-space: pre-wrap;
`;

const NumberingText = styled.p`
  line-height: 1.25;
  color: orange;
  margin: 0;
  flex: 1;
  font-size: 5vw;
  white-space: pre-wrap;
`;

type Props = {
  nextStation: Station | undefined;
  language: LanguageState;
};

const SwitchedStationText = ({ nextStation, language }: Props) => {
  const { passingStation } = useAtomValue(stationAtom);
  const { arrived, approaching } = useAtomValue(navigationAtom);

  const currentStation = useCurrentStation();

  const currentStationNameWithKey = useMemo(
    () =>
      currentStation.name.split("").map((c, i) => ({
        key: `${currentStation.name}-${i}`,
        value: c,
      })),
    [currentStation.name],
  );
  const currentStationNameKWithKey = useMemo(
    () =>
      currentStation.nameKatakana
        .split("")
        .map((c, i) => ({
          key: `${currentStation.nameKatakana}-${i}`,
          value: c,
        })),
    [currentStation.nameKatakana],
  );
  const nextStationNameWithKey = useMemo(
    () =>
      nextStation?.name.split("").map((c, i) => ({
        key: `${nextStation.name}-${i}`,
        value: c,
      })),
    [nextStation],
  );
  const nextStationNameKWithKey = useMemo(
    () =>
      nextStation?.nameKatakana.split("").map((c, i) => ({
        key: `${nextStation?.nameKatakana}-${i}`,
        value: c,
      })),
    [nextStation],
  );

  if ((arrived || !nextStation) && currentStation && !passingStation) {
    return (
      <TextContainer>
        {language === "ja"
          ? (
            <OrangeTextContainer>
              {currentStationNameWithKey.map(({ key, value }) => (
                <OrangeText key={key}>{value}</OrangeText>
              ))}
            </OrangeTextContainer>
          )
          : null}
        {language === "jaKana"
          ? (
            <OrangeTextContainer>
              {currentStationNameKWithKey.map(({ key, value }) => (
                <OrangeText key={key}>{value}</OrangeText>
              ))}
            </OrangeTextContainer>
          )
          : null}
        {language === "en"
          ? (
            <>
              <StationInfoGroup>
                <OrangeTextContainer>
                  <OrangeText>{currentStation.nameRoman}</OrangeText>
                </OrangeTextContainer>

                <NumberingText>
                  {currentStation.stationNumbers.length
                    ? `(${currentStation.stationNumbers[0]?.stationNumber})`
                    : ""}
                </NumberingText>
              </StationInfoGroup>
            </>
          )
          : null}
      </TextContainer>
    );
  }

  if (approaching && nextStation) {
    return (
      <TextContainer>
        {language === "ja"
          ? (
            <>
              <StateText>まもなく</StateText>
              <OrangeTextContainer>
                {nextStationNameWithKey?.map(({ key, value }) => (
                  <OrangeText key={key}>{value}</OrangeText>
                ))}
              </OrangeTextContainer>
            </>
          )
          : null}
        {language === "jaKana"
          ? (
            <>
              <StateText>まもなく</StateText>
              <OrangeTextContainer>
                {nextStationNameKWithKey?.map(({ key, value }) => (
                  <OrangeText key={key}>{value}</OrangeText>
                ))}
              </OrangeTextContainer>
            </>
          )
          : null}
        {language === "en"
          ? (
            <>
              <StateText>Soon</StateText>
              <StationInfoGroup>
                <OrangeTextContainer>
                  <OrangeText>{nextStation.nameRoman}</OrangeText>
                </OrangeTextContainer>

                <NumberingText>
                  {nextStation.stationNumbers.length
                    ? `(${nextStation.stationNumbers[0]?.stationNumber})`
                    : ""}
                </NumberingText>
              </StationInfoGroup>
            </>
          )
          : null}
      </TextContainer>
    );
  }

  if (!nextStation) {
    return null;
  }
  return (
    <TextContainer>
      {language === "ja"
        ? (
          <>
            <StateText>次は</StateText>
            <OrangeTextContainer>
              {nextStationNameWithKey?.map(({ key, value }) => (
                <OrangeText key={key}>{value}</OrangeText>
              ))}
            </OrangeTextContainer>
          </>
        )
        : null}
      {language === "jaKana"
        ? (
          <>
            <StateText>次は</StateText>
            <OrangeTextContainer>
              {nextStationNameKWithKey?.map(({ key, value }) => (
                <OrangeText key={key}>{value}</OrangeText>
              ))}
            </OrangeTextContainer>
          </>
        )
        : null}
      {language === "en"
        ? (
          <>
            <StateText>Next</StateText>
            <StationInfoGroup>
              <OrangeTextContainer>
                <OrangeText>{nextStation.nameRoman}</OrangeText>
              </OrangeTextContainer>

              <NumberingText>
                {nextStation.stationNumbers.length
                  ? `(${nextStation.stationNumbers[0]?.stationNumber})`
                  : ""}
              </NumberingText>
            </StationInfoGroup>
          </>
        )
        : null}
    </TextContainer>
  );
};

const MainTopText = (props: Props) => {
  return (
    <Container>
      <SwitchedStationText {...props} />
    </Container>
  );
};

export default MainTopText;
