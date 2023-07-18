import { useAtomValue } from "jotai";
import { useMemo } from "react";
import Marquee from "react-fast-marquee";
import styled from "styled-components";
import { lineAtom } from "../atoms/line";
import { navigationAtom } from "../atoms/navigation";
import { trainTypeAtom } from "../atoms/trainType";
import { parenthesisRegexp } from "../constants/regexp";
import { StopCondition } from "../generated/stationapi_pb";
import useBounds from "../hooks/useBounds";
import type { Line, Station } from "../models/grpc";
import {
  getIsLoopLine,
  getIsMeijoLine,
  getIsOsakaLoopLine,
  getIsYamanoteLine,
} from "../utils/loopLine";
import { getTrainTypeString } from "../utils/trainTypeString";
import HorizontalSpacer from "./HorizontalSpacer";

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
const CrimsonText = styled.span`
  color: crimson;
`;

const LanguageSpacer = styled.div`
  width: 50vw;
`;

type Props = {
  nextStation: Station | undefined;
  afterNextStation: Station | undefined;
  line: Line;
};

const MainMarquee = (props: Props) => {
  const { nextStation, line, afterNextStation } = props;

  const { trainType } = useAtomValue(trainTypeAtom);
  const { selectedDirection } = useAtomValue(lineAtom);
  const { arrived, approaching } = useAtomValue(navigationAtom);

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
    const jaText = bounds[index]
      .map((station) => station.name.replace(parenthesisRegexp, ""))
      .join("・");
    const enText = bounds[index]
      .map(
        (station) =>
          `${station.nameRoman.replace(parenthesisRegexp, "")}${
            station.stationNumbersList[0]?.stationNumber
              ? `(${station.stationNumbersList[0]?.stationNumber})`
              : ""
          }`
      )
      .join(" and ");
    return [`${jaText}${getIsLoopLine(line, trainType) ? "方面" : ""}`, enText];
  }, [bounds, line, selectedDirection, trainType]);

  const trainTypeTexts = useMemo(() => {
    if (
      (getIsYamanoteLine(line.id) || getIsOsakaLoopLine(line.id)) &&
      selectedDirection
    ) {
      if (getIsMeijoLine(line.id)) {
        return [
          selectedDirection === "INBOUND" ? "左回り" : "右回り",
          selectedDirection === "INBOUND" ? "Counterclockwise" : "Clockwise",
        ];
      }
      return [
        selectedDirection === "INBOUND" ? "内回り" : "外回り",
        selectedDirection === "INBOUND" ? "Counterclockwise" : "Clockwise",
      ];
    }

    switch (
      nextStation &&
      getTrainTypeString(line, nextStation, selectedDirection)
    ) {
      case "rapid":
        return ["快速", "Rapid"];
      case "ltdexp":
        return ["特急", "Limited Express"];
      default:
        return [trainType?.name ?? "", trainType?.nameRoman ?? ""];
    }
  }, [line, nextStation, selectedDirection, trainType]);

  const transferTexts = useMemo(() => {
    if (!nextStation) {
      return "";
    }

    const filteredLines = nextStation.linesList.filter(
      (line) => line.id !== nextStation.line?.id
    );
    const headTextForEn =
      filteredLines.length > 1
        ? filteredLines
            .slice(0, filteredLines.length - 1)
            .map((line) => line.nameRoman.replace(parenthesisRegexp, ""))
            .join(", the ")
        : filteredLines.map((line) => line.nameRoman).join("");

    if (filteredLines.length <= 1) {
      return [
        filteredLines
          .map((line) => line.nameShort.replace(parenthesisRegexp, ""))
          .join("、")
          .replace(parenthesisRegexp, ""),
        headTextForEn,
      ];
    }

    const tailTextForEn = filteredLines
      .slice(-1)[0]
      ?.nameRoman?.replace(parenthesisRegexp, "");

    return [
      filteredLines
        .map((line) => line.nameShort.replace(parenthesisRegexp, ""))
        .join("、")
        .replace(parenthesisRegexp, ""),
      `${headTextForEn} and the ${tailTextForEn}`,
    ];
  }, [nextStation]);

  if (!nextStation) {
    return <Container />;
  }

  if (approaching && !arrived) {
    return (
      <Container>
        <Marquee gradient={false} speed={300}>
          <InnerContainer>
            <LanguageSpacer />
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
                  {nextStation.stopCondition !== StopCondition.ALL && (
                    <>
                      <CrimsonText>
                        {nextStation.name}
                        は一部列車は通過いたします。
                      </CrimsonText>
                      <OrangeText>ご注意ください。</OrangeText>
                    </>
                  )}
                </>
              ) : null}
              <HorizontalSpacer />
              {nextStation.linesList.filter(
                (line) => line.id !== nextStation.line?.id
              ).length > 0 && (
                <>
                  <OrangeText>{transferTexts[0]}</OrangeText>
                  <HorizontalSpacer />
                  <GreenText>はお乗り換えです。</GreenText>
                </>
              )}

              <LanguageSpacer />

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
                  <GreenText>.</GreenText>
                </>
              ) : null}
              <GreenText>.</GreenText>
              {nextStation.linesList.filter(
                (line) => line.id !== nextStation.line?.id
              ).length > 0 && (
                <>
                  <HorizontalSpacer />
                  <GreenText>Please change here for</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>the {transferTexts[1]}</OrangeText>
                  <GreenText>.</GreenText>
                </>
              )}
            </TextContainer>
            <HorizontalSpacer />
            <LanguageSpacer />
          </InnerContainer>
        </Marquee>
      </Container>
    );
  }

  if (!approaching && !arrived) {
    return (
      <Container>
        <Marquee gradient={false} speed={300}>
          <InnerContainer>
            <LanguageSpacer />
            <TextContainer>
              <GreenText>次は</GreenText>
              <OrangeText>{nextStation.name}</OrangeText>
              <GreenText>です。</GreenText>
              {afterNextStation ? (
                <>
                  <OrangeText>{nextStation.name}</OrangeText>
                  <GreenText>の次は</GreenText>
                  <OrangeText>{afterNextStation.name}</OrangeText>
                  <GreenText>に停車いたします。</GreenText>
                  {nextStation.stopCondition !== StopCondition.ALL && (
                    <>
                      <CrimsonText>
                        {nextStation.name}
                        は一部列車は通過いたします。
                      </CrimsonText>
                      <OrangeText>ご注意ください。</OrangeText>
                    </>
                  )}
                </>
              ) : null}
              <HorizontalSpacer />
              {nextStation.linesList.filter(
                (line) => line.id !== nextStation.line?.id
              ).length > 0 && (
                <>
                  <OrangeText>{transferTexts[0]}</OrangeText>
                  <HorizontalSpacer />
                  <GreenText>はお乗り換えです。</GreenText>
                </>
              )}

              <LanguageSpacer />

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
                  <GreenText>.</GreenText>
                </>
              ) : null}
              {nextStation.linesList.filter(
                (line) => line.id !== nextStation.line?.id
              ).length > 0 && (
                <>
                  <HorizontalSpacer />
                  <GreenText>Please change here for</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>the {transferTexts[1]}</OrangeText>
                  <GreenText>.</GreenText>
                </>
              )}
            </TextContainer>
            <HorizontalSpacer />
          </InnerContainer>
          <LanguageSpacer />
        </Marquee>
      </Container>
    );
  }

  return (
    <Container>
      <Marquee gradient={false} speed={300}>
        <InnerContainer>
          <LanguageSpacer />
          <TextContainer>
            <GreenText>
              この電車は、{line.nameShort.replace(parenthesisRegexp, "")}
            </GreenText>
            <HorizontalSpacer />
            <OrangeText>
              {trainTypeTexts[0]}
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
            <OrangeText>{trainTypeTexts[1]}</OrangeText>
            <GreenText>train for</GreenText>
            <HorizontalSpacer />
            <OrangeText>{boundTexts[1]}</OrangeText>
            <GreenText>.</GreenText>
          </TextContainer>
          <LanguageSpacer />
        </InnerContainer>
      </Marquee>
    </Container>
  );
};

export default MainMarquee;
