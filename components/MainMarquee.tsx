import Marquee from "react-fast-marquee";
import styled from "styled-components";
import { Station } from "../models/StationAPI";

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
  nextStations: Station[];
};

const MainMarquee = ({ bound, nextStations }: Props) => {
  return (
    <Marquee gradient={false} speed={180}>
      <InnerContainer>
        <TextContainer>
          <GreenText>この電車は</GreenText>
          <RedText>{bound.name}ゆき。</RedText>
          <LanguageSpacer />
          <YellowText>For {bound.nameR}.</YellowText>
        </TextContainer>
        <Spacer />
        {nextStations[1] ? (
          <TextContainer>
            <GreenText>次は</GreenText>
            <RedText>{nextStations[1].name}</RedText>
            <LanguageSpacer />
            <GreenText>つぎは</GreenText>
            <RedText>{nextStations[1].nameK}</RedText>

            <LanguageSpacer />
            <YellowText>Next {nextStations[1].nameR}.</YellowText>
          </TextContainer>
        ) : null}
        <Spacer />
      </InnerContainer>
    </Marquee>
  );
};

export default MainMarquee;
