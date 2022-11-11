import { useMemo } from "react";
import Marquee from "react-fast-marquee";
import styled from "styled-components";
import { parenthesisRegexp } from "../constants/regexp";
import type { Line, Station } from "../models/StationAPI";

const InnerContainer = styled.div`
  display: flex;
  mask: radial-gradient(1px, #fff 100%, transparent 100%) 0 0/2px 2px;
`;

const TextContainer = styled.div`
  font-size: 4rem;
  white-space: nowrap;
  display: flex;
`;

const Container = styled.div`
  flex: 1;
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
const SmallSpacer = styled.div`
  width: 1.5rem;
`;

const LanguageSpacer = styled.div`
  width: 5vw;
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
    const first = line.nameR[0].toLowerCase();
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
  }, [line.nameR]);

  if (arrived) {
    return (
      <Container>
        <Marquee gradient={false} speed={300}>
          <InnerContainer>
            <Spacer />
            <TextContainer>
              <GreenText>
                この電車は、{line.name.replace(parenthesisRegexp, "")}、
              </GreenText>
              <OrangeText>{bound.name}</OrangeText>
              <GreenText>行きです。</GreenText>
              <LanguageSpacer />
              <GreenText>{`This is ${aOrAn} ${line.nameR.replace(
                parenthesisRegexp,
                ""
              )} train for`}</GreenText>
              <SmallSpacer />
              <OrangeText>
                {bound.nameR}
                {bound.stationNumbers.length
                  ? `(${bound.stationNumbers[0]?.stationNumber})`
                  : ""}
              </OrangeText>
              <GreenText>.</GreenText>
            </TextContainer>
            <Spacer />
          </InnerContainer>
        </Marquee>
      </Container>
    );
  }

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

              <LanguageSpacer />

              <GreenText>The next stop is</GreenText>
              <OrangeText>
                {nextStation.nameR}
                {nextStation.stationNumbers.length
                  ? `(${nextStation.stationNumbers[0]?.stationNumber})`
                  : ""}
              </OrangeText>
              {afterNextStation ? (
                <>
                  <GreenText>. The stop after </GreenText>
                  <OrangeText>
                    {nextStation.nameR}
                    {nextStation.stationNumbers.length
                      ? `(${nextStation.stationNumbers[0]?.stationNumber})`
                      : ""}
                  </OrangeText>
                  <GreenText>, will be </GreenText>
                  <SmallSpacer />
                  <OrangeText>
                    {afterNextStation.nameR}
                    {afterNextStation.stationNumbers.length
                      ? `(${afterNextStation.stationNumbers[0]?.stationNumber})`
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

  return <Container />;
};

export default MainMarquee;
