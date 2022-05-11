import Marquee from "react-fast-marquee";
import styled from "styled-components";
import type { Station } from "../models/StationAPI";

const InnerContainer = styled.div`
  display: flex;
  mask: radial-gradient(1px, #fff 100%, transparent 100%) 0 0/2px 2px;
`;

const TextContainer = styled.div`
  font-size: 3rem;
  white-space: nowrap;
  display: flex;
  text-align: right;
`;

const GreenText = styled.span`
  color: green;
`;
const RedText = styled.span`
  color: red;
`;
const YellowText = styled.span`
  color: yellow;
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
};
type SwitchedStationTextProps = {
  arrived: boolean;
  approaching: boolean;
  currentStation: Station | undefined;
  nextStation: Station | undefined;
};

const SwitchedStationText = ({
  arrived,
  approaching,
  currentStation,
  nextStation,
}: SwitchedStationTextProps) => {
  if (arrived && currentStation) {
    return (
      <TextContainer>
        <GreenText>ただいま</GreenText>
        <RedText>{currentStation.name}</RedText>
        <LanguageSpacer />
        <GreenText>ただいま{currentStation.nameK}</GreenText>

        <LanguageSpacer />
        <YellowText>
          {currentStation.nameR}
          {currentStation.fullStationNumber
            ? `(${currentStation.fullStationNumber}).`
            : "."}
        </YellowText>
      </TextContainer>
    );
  }
  if (approaching && currentStation) {
    return (
      <TextContainer>
        <GreenText>まもなく</GreenText>
        <RedText>{currentStation.name}</RedText>
        <LanguageSpacer />
        <GreenText>まもなく{currentStation.nameK}</GreenText>

        <LanguageSpacer />
        <YellowText>Next {currentStation.nameR}.</YellowText>
      </TextContainer>
    );
  }

  if (!nextStation) {
    return null;
  }
  return (
    <TextContainer>
      <GreenText>次は</GreenText>
      <RedText>{nextStation.name}</RedText>
      <LanguageSpacer />
      <GreenText>つぎは{nextStation.nameK}</GreenText>

      <LanguageSpacer />
      <YellowText>
        Next {nextStation.nameR}{" "}
        {nextStation.fullStationNumber
          ? `(${nextStation.fullStationNumber})`
          : ""}
        . .
      </YellowText>
    </TextContainer>
  );
};

const MainMarquee = (props: Props) => {
  const { bound, ...rest } = props;

  return (
    <Marquee gradient={false} speed={180}>
      <InnerContainer>
        <TextContainer>
          <GreenText>この電車は</GreenText>
          <RedText>{bound.name}ゆき。</RedText>
          <LanguageSpacer />
          <YellowText>
            For {bound.nameR}
            {bound.fullStationNumber ? `(${bound.fullStationNumber})` : ""}.
          </YellowText>
        </TextContainer>
        <Spacer />
        <SwitchedStationText {...rest} />
        <Spacer />
      </InnerContainer>
    </Marquee>
  );
};

export default MainMarquee;
