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
  font-size: 5rem;
  white-space: nowrap;
  display: flex;
  user-select: none;
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
const LanguageSpacer = styled.div`
  width: 5vw;
`;

type Props = {
  bound: Station;
  currentStation: Station | undefined;
  nextStation: Station | undefined;
  arrived: boolean;
  approaching: boolean;
  line: Line;
};

const MainMarquee = (props: Props) => {
  const { bound, line } = props;

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

  return (
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
          <OrangeText>
            {" "}
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
  );
};

export default MainMarquee;
