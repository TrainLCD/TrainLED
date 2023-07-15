import { useAtomValue } from "jotai";
import { useMemo } from "react";
import Marquee from "react-fast-marquee";
import styled from "styled-components";
import { lineAtom } from "../atoms/line";
import { trainTypeAtom } from "../atoms/trainType";
import { parenthesisRegexp } from "../constants/regexp";
import useBounds from "../hooks/useBounds";
import type { Line, Station } from "../models/grpc";
import { getIsLoopLine } from "../utils/loopLine";

const InnerContainer = styled.div`
  display: flex;
  mask: radial-gradient(1px, #fff 100%, transparent 100%) 0 0/2px 2px;
`;

const TextContainer = styled.div`
  font-size: 7.5vw;
  white-space: nowrap;
  display: flex;
`;

const Container = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
`;

const GreenText = styled.span`
  color: green;
`;
const OrangeText = styled.span`
  color: orange;
`;

const Spacer = styled.div`
  width: 50vw;
`;

const HorizontalSpacer = styled.div<{ wide?: boolean }>`
  width: ${({ wide }) => (wide ? 10 : 2.5)}vw;
`;

type Props = {
  nextStation: Station | undefined;
  afterNextStation: Station | undefined;
  arrived: boolean;
  approaching: boolean;
  line: Line;
};

const MainMarquee = (props: Props) => {
  const { nextStation, line, arrived, approaching, afterNextStation } = props;

  const { trainType } = useAtomValue(trainTypeAtom);
  const { selectedDirection } = useAtomValue(lineAtom);

  const { bounds } = useBounds();

  const aOrAn = useMemo(() => {
    const first = line.nameRoman[0].toLowerCase();
    switch (first) {
      case "a":
      case "e":
      case "i":
      case "o":
      case "u":
        return "an";
      default:
        return "a";
    }
  }, [line.nameRoman]);

  const boundTexts = useMemo(() => {
    const index = selectedDirection === "INBOUND" ? 0 : 1;
    const jaText = bounds[index].map((station) => station.name).join("・");
    const enText = bounds[index]
      .map(
        (station) =>
          `${station.nameRoman}${
            station.stationNumbersList[0]?.stationNumber
              ? `(${station.stationNumbersList[0]?.stationNumber})`
              : ""
          }`
      )
      .join(" and ");
    return [`${jaText}${getIsLoopLine(line, trainType) ? "方面" : ""}`, enText];
  }, [bounds, line, selectedDirection, trainType]);

  if (!nextStation) {
    return <Container />;
  }

  if (approaching && !arrived) {
    return (
      <Container>
        <Marquee gradient={false} speed={300}>
          <InnerContainer>
            <Spacer />
            <TextContainer>
              <GreenText>まもなく</GreenText>
              <OrangeText>{nextStation.name}</OrangeText>
              <GreenText>です。</GreenText>
              {afterNextStation ? (
                <>
                  <OrangeText>{nextStation.name}</OrangeText>
                  <GreenText>の次は</GreenText>
                  <OrangeText>{afterNextStation.name}</OrangeText>
                  <GreenText>に停車いたします。</GreenText>
                </>
              ) : null}

              <HorizontalSpacer />

              <GreenText>The next stop is</GreenText>
              <HorizontalSpacer />
              <OrangeText>
                {nextStation.nameRoman}
                {nextStation.stationNumbersList.length
                  ? `(${nextStation.stationNumbersList[0]?.stationNumber})`
                  : ""}
              </OrangeText>
              {afterNextStation ? (
                <>
                  <GreenText>. The stop after </GreenText>
                  <HorizontalSpacer />
                  <OrangeText>
                    {nextStation.nameRoman}
                    {nextStation.stationNumbersList.length
                      ? `(${nextStation.stationNumbersList[0]?.stationNumber})`
                      : ""}
                  </OrangeText>
                  <GreenText>, will be </GreenText>
                  <HorizontalSpacer />
                  <OrangeText>
                    {afterNextStation.nameRoman}
                    {afterNextStation.stationNumbersList.length
                      ? `(${afterNextStation.stationNumbersList[0]?.stationNumber})`
                      : ""}
                  </OrangeText>
                </>
              ) : null}
              <GreenText>.</GreenText>
            </TextContainer>
            <Spacer />
          </InnerContainer>
        </Marquee>
      </Container>
    );
  }

  return (
    <Container>
      <Marquee gradient={false} speed={300}>
        <InnerContainer>
          <Spacer />
          <TextContainer>
            <GreenText>
              この電車は、{line.nameShort.replace(parenthesisRegexp, "")}
            </GreenText>
            <HorizontalSpacer />
            <OrangeText>
              {(!getIsLoopLine(line, trainType) &&
                trainType?.name?.replace(parenthesisRegexp, "")) ??
                "普通"}
              {getIsLoopLine(line, trainType) &&
                selectedDirection &&
                (selectedDirection === "INBOUND" ? "内回り" : "外回り")}
              <OrangeText>{` ${boundTexts[0]}`}</OrangeText>
              行き
            </OrangeText>
            <HorizontalSpacer />
            <GreenText>です。</GreenText>
            <HorizontalSpacer wide />
            <GreenText>{`This is ${aOrAn} ${line.nameRoman.replace(
              parenthesisRegexp,
              ""
            )}`}</GreenText>
            <HorizontalSpacer />
            <OrangeText>
              {(!getIsLoopLine(line, trainType) &&
                trainType?.nameRoman?.replace(parenthesisRegexp, "")) ??
                "Local"}
              {getIsLoopLine(line, trainType) &&
                selectedDirection &&
                (selectedDirection === "INBOUND"
                  ? "Counter-clockwise"
                  : "Clockwise")}
            </OrangeText>
            <HorizontalSpacer />
            <GreenText>train for</GreenText>
            <HorizontalSpacer />
            <OrangeText>{boundTexts[1]}</OrangeText>
            <GreenText>.</GreenText>
          </TextContainer>
          <Spacer />
        </InnerContainer>
      </Marquee>
    </Container>
  );
};

export default MainMarquee;
