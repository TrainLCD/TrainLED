import { useMemo } from "react";
import Marquee from "react-fast-marquee";
import styled from "styled-components";
import { parenthesisRegexp } from "../constants/regexp";
import type { Line, Station } from "../models/grpc";

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
  bound: Station;
  nextStation: Station | undefined;
  afterNextStation: Station | undefined;
  arrived: boolean;
  approaching: boolean;
  line: Line;
};

const MainMarquee = (props: Props) => {
  const { bound, nextStation, line, arrived, approaching, afterNextStation } =
    props;

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

  if (approaching && nextStation) {
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
            <OrangeText>普通 {bound.name}行き</OrangeText>
            <HorizontalSpacer />
            <GreenText>です。</GreenText>
            <HorizontalSpacer wide />
            <GreenText>{`This is ${aOrAn} ${line.nameRoman.replace(
              parenthesisRegexp,
              ""
            )}`}</GreenText>
            <HorizontalSpacer />
            <OrangeText>Local</OrangeText>
            <HorizontalSpacer />
            <GreenText>train for</GreenText>
            <HorizontalSpacer />
            <OrangeText>
              {bound.nameRoman}
              {bound.stationNumbersList.length
                ? `(${bound.stationNumbersList[0]?.stationNumber})`
                : ""}
            </OrangeText>
            <GreenText>.</GreenText>
          </TextContainer>
          <Spacer />
        </InnerContainer>
      </Marquee>
    </Container>
  );

  return <Container />;
};

export default MainMarquee;
