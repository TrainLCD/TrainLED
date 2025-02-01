import {
  type Line,
  type Station,
  StopCondition,
} from '@/generated/src/proto/stationapi_pb';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import Marquee from 'react-fast-marquee';
import styled from 'styled-components';
import { lineAtom } from '../atoms/line';
import { navigationAtom } from '../atoms/navigation';
import { stationAtom } from '../atoms/station';
import { PARENTHESIS_REGEXP } from '../constants';
import useBounds from '../hooks/useBounds';
import { useCurrentLine } from '../hooks/useCurrentLine';
import { useCurrentStation } from '../hooks/useCurrentStation';
import useCurrentTrainType from '../hooks/useCurrentTrainType';
import { useIsLastStop } from '../hooks/useIsLastStop';
import {
  getIsLoopLine,
  getIsMeijoLine,
  getIsOsakaLoopLine,
  getIsYamanoteLine,
} from '../utils/loopLine';
import { getIsLocal, getTrainTypeString } from '../utils/trainTypeString';
import HorizontalSpacer from './HorizontalSpacer';

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  mask: radial-gradient(1px, #fff 100%, transparent 100%) 0 0/2px 2px;
  margin-right: 50vw;
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

const MIN_SCROLL_SPEED = 400;
const MAX_SCROLL_SPEED = 700;

const MainMarquee = ({ nextStation, line, afterNextStation }: Props) => {
  const { selectedDirection } = useAtomValue(lineAtom);
  const { arrived, approaching } = useAtomValue(navigationAtom);
  const { passingStation } = useAtomValue(stationAtom);

  const { boundText } = useBounds();
  const currentStation = useCurrentStation();
  const currentLine = useCurrentLine();
  const isLastStop = useIsLastStop();
  const trainType = useCurrentTrainType();

  const scrollSpeed = (() => {
    if (typeof window === 'undefined') {
      return;
    }
    const computedScrollSpeed = window.innerWidth / 2;
    const tooNarrowScreen = window.innerWidth < 450;
    const tooWideScreen = window.innerWidth > 1000;
    if (tooNarrowScreen) {
      return MIN_SCROLL_SPEED;
    }
    if (tooWideScreen) {
      return MAX_SCROLL_SPEED;
    }
    return computedScrollSpeed;
  })();

  const trainTypeText = useMemo<{ ja: string; en: string }>(() => {
    if (
      (getIsYamanoteLine(line.id) || getIsOsakaLoopLine(line.id)) &&
      selectedDirection
    ) {
      if (getIsMeijoLine(line.id)) {
        return {
          ja: selectedDirection === 'INBOUND' ? '左回り' : '右回り',
          en:
            selectedDirection === 'INBOUND' ? 'Counterclockwise' : 'Clockwise',
        };
      }
      return {
        ja: selectedDirection === 'INBOUND' ? '内回り' : '外回り',
        en: selectedDirection === 'INBOUND' ? 'Counterclockwise' : 'Clockwise',
      };
    }

    switch (
      nextStation &&
      getTrainTypeString(line, nextStation, selectedDirection)
    ) {
      case 'rapid':
        return { ja: '快速', en: 'Rapid' };
      case 'ltdexp':
        return { ja: '特急', en: 'Limited Express' };
      default:
        return {
          ja: trainType?.name?.replace(PARENTHESIS_REGEXP, '') ?? '',
          en: trainType?.nameRoman?.replace(PARENTHESIS_REGEXP, '') ?? '',
        };
    }
  }, [line, nextStation, selectedDirection, trainType]);

  const transferText = useMemo<{ ja: string; en: string }>(() => {
    if (!nextStation) {
      return { ja: '', en: '' };
    }

    const filteredLines = nextStation.lines.filter(
      (line) => line.id !== nextStation.line?.id
    );
    const headTextForEn =
      filteredLines.length > 1
        ? filteredLines
            .slice(0, filteredLines.length - 1)
            .map((line) => line.nameRoman?.replace(PARENTHESIS_REGEXP, ''))
            .join(', the ')
        : filteredLines
            .map((line) => line.nameRoman?.replace(PARENTHESIS_REGEXP, ''))
            .join('');

    if (filteredLines.length <= 1) {
      return {
        ja: filteredLines
          .map((line) => line.nameShort.replace(PARENTHESIS_REGEXP, ''))
          .join('、')
          .replace(PARENTHESIS_REGEXP, ''),
        en: headTextForEn,
      };
    }

    const tailTextForEn = filteredLines
      .slice(-1)[0]
      ?.nameRoman?.replace(PARENTHESIS_REGEXP, '');

    return {
      ja: filteredLines
        .map((line) => line.nameShort.replace(PARENTHESIS_REGEXP, ''))
        .join('、')
        .replace(PARENTHESIS_REGEXP, ''),
      en: `${headTextForEn} and the ${tailTextForEn}`,
    };
  }, [nextStation]);

  const isLocal =
    getIsLocal(trainType) || getIsLoopLine(currentLine, trainType);

  if (passingStation) {
    return (
      <Container>
        <Marquee gradient={false} speed={scrollSpeed}>
          <InnerContainer>
            <TextContainer>
              <GreenText>ただいま</GreenText>
              <HorizontalSpacer />
              <OrangeText>{passingStation.name}駅</OrangeText>
              <HorizontalSpacer />
              <GreenText>を通過。</GreenText>
            </TextContainer>
            <LanguageSpacer />
            <TextContainer>
              <GreenText>Passing</GreenText>
              <HorizontalSpacer />
              <OrangeText>
                {passingStation.nameRoman}
                {passingStation.stationNumbers.length
                  ? `(${passingStation.stationNumbers[0]?.stationNumber})`
                  : ''}
              </OrangeText>
              <HorizontalSpacer />
              <GreenText>Station.</GreenText>
            </TextContainer>
          </InnerContainer>
        </Marquee>
      </Container>
    );
  }

  if (arrived && isLastStop && currentStation) {
    return (
      <Container>
        <Marquee gradient={false} speed={scrollSpeed}>
          <InnerContainer>
            <TextContainer>
              <GreenText>ただいま</GreenText>
              <OrangeText>{currentStation.name}</OrangeText>
              <HorizontalSpacer />
              <CrimsonText>終点</CrimsonText>
              <HorizontalSpacer />
              <GreenText>です。</GreenText>
              <HorizontalSpacer />
              {currentStation.lines.filter(
                (line) => line.id !== currentStation.line?.id
              ).length > 0 && (
                <>
                  <OrangeText>{transferText.ja}</OrangeText>
                  <HorizontalSpacer />
                  <GreenText>はお乗り換えです。</GreenText>
                </>
              )}

              <GreenText>今日も、</GreenText>
              <OrangeText>{currentStation.line?.nameShort}</OrangeText>
              <GreenText>
                をご利用くださいまして、ありがとうございました。
              </GreenText>

              <LanguageSpacer />

              <GreenText>Now stopping at</GreenText>
              <HorizontalSpacer />
              <OrangeText>
                {currentStation.nameRoman}
                {currentStation.stationNumbers.length
                  ? `(${currentStation.stationNumbers[0]?.stationNumber})`
                  : ''}
              </OrangeText>
              <HorizontalSpacer />
              <CrimsonText>last stop</CrimsonText>
              <GreenText>.</GreenText>
              {currentStation.lines.filter(
                (line) => line.id !== currentStation.line?.id
              ).length > 0 && (
                <>
                  <HorizontalSpacer />
                  <GreenText>Please change here for</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>the {transferText.en}</OrangeText>
                  <GreenText>.</GreenText>
                </>
              )}
            </TextContainer>
          </InnerContainer>
        </Marquee>
      </Container>
    );
  }

  if (!nextStation) {
    return <Container />;
  }

  if (approaching && !arrived) {
    return (
      <Container>
        <Marquee gradient={false} speed={scrollSpeed}>
          <InnerContainer>
            <TextContainer>
              <GreenText>まもなく</GreenText>
              <HorizontalSpacer />
              <OrangeText>{nextStation.name}</OrangeText>
              <HorizontalSpacer />
              {!afterNextStation ? (
                <>
                  <HorizontalSpacer />
                  <CrimsonText>終点</CrimsonText>
                  <HorizontalSpacer />
                </>
              ) : null}
              <GreenText>です。</GreenText>
              {afterNextStation ? (
                <>
                  <OrangeText>{nextStation.name}</OrangeText>
                  <GreenText>の次は</GreenText>
                  <OrangeText>{afterNextStation.name}</OrangeText>
                  <GreenText>に停車いたします。</GreenText>
                  {nextStation.stopCondition !== StopCondition.All && (
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
              {nextStation.lines.filter(
                (line) => line.id !== nextStation.line?.id
              ).length > 0 && (
                <>
                  <OrangeText>{transferText.ja}</OrangeText>
                  <HorizontalSpacer />
                  <GreenText>はお乗り換えです。</GreenText>
                </>
              )}

              <LanguageSpacer />

              <GreenText>The next stop is</GreenText>
              <HorizontalSpacer />
              <OrangeText>
                {nextStation.nameRoman}
                {nextStation.stationNumbers.length
                  ? `(${nextStation.stationNumbers[0]?.stationNumber})`
                  : ''}
              </OrangeText>
              {!afterNextStation ? (
                <>
                  <HorizontalSpacer />
                  <CrimsonText>last stop</CrimsonText>
                  <GreenText>.</GreenText>
                </>
              ) : null}
              {afterNextStation ? (
                <>
                  <GreenText>. The stop after</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>
                    {nextStation.nameRoman}
                    {nextStation.stationNumbers.length
                      ? `(${nextStation.stationNumbers[0]?.stationNumber})`
                      : ''}
                  </OrangeText>
                  <GreenText>, will be</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>
                    {afterNextStation.nameRoman}
                    {afterNextStation.stationNumbers.length
                      ? `(${afterNextStation.stationNumbers[0]?.stationNumber})`
                      : ''}
                  </OrangeText>
                  <GreenText>.</GreenText>
                </>
              ) : (
                <GreenText>.</GreenText>
              )}
              {nextStation.lines.filter(
                (line) => line.id !== nextStation.line?.id
              ).length > 0 && (
                <>
                  <HorizontalSpacer />
                  <GreenText>Please change here for</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>the {transferText.en}</OrangeText>
                  <GreenText>.</GreenText>
                </>
              )}
            </TextContainer>
          </InnerContainer>
        </Marquee>
      </Container>
    );
  }

  if (!approaching && !arrived) {
    return (
      <Container>
        <Marquee gradient={false} speed={scrollSpeed}>
          <InnerContainer>
            <TextContainer>
              <GreenText>次は</GreenText>
              <HorizontalSpacer />
              <OrangeText>{nextStation.name}</OrangeText>
              {!afterNextStation ? (
                <>
                  <HorizontalSpacer />
                  <CrimsonText>終点</CrimsonText>
                  <HorizontalSpacer />
                </>
              ) : null}
              <GreenText>です。</GreenText>
              {afterNextStation ? (
                <>
                  <OrangeText>{nextStation.name}</OrangeText>
                  <GreenText>の次は</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>{afterNextStation.name}</OrangeText>
                  <HorizontalSpacer />
                  <GreenText>に停車いたします。</GreenText>
                  {nextStation.stopCondition !== StopCondition.All && (
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
              {nextStation.lines.filter(
                (line) => line.id !== nextStation.line?.id
              ).length > 0 && (
                <>
                  <OrangeText>{transferText.ja}</OrangeText>
                  <HorizontalSpacer />
                  <GreenText>はお乗り換えです。</GreenText>
                </>
              )}

              <LanguageSpacer />

              <GreenText>The next stop is</GreenText>
              <HorizontalSpacer />
              <OrangeText>
                {nextStation.nameRoman}
                {nextStation.stationNumbers.length
                  ? `(${nextStation.stationNumbers[0]?.stationNumber})`
                  : ''}
              </OrangeText>
              {!afterNextStation ? (
                <>
                  <HorizontalSpacer />
                  <CrimsonText>last stop</CrimsonText>
                  <GreenText>.</GreenText>
                </>
              ) : null}
              {afterNextStation ? (
                <>
                  <GreenText>. The stop after</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>
                    {nextStation.nameRoman}
                    {nextStation.stationNumbers.length
                      ? `(${nextStation.stationNumbers[0]?.stationNumber})`
                      : ''}
                  </OrangeText>
                  <GreenText>, will be</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>
                    {afterNextStation.nameRoman}
                    {afterNextStation.stationNumbers.length
                      ? `(${afterNextStation.stationNumbers[0]?.stationNumber})`
                      : ''}
                  </OrangeText>
                  <GreenText>.</GreenText>
                </>
              ) : null}
              {nextStation.lines.filter(
                (line) => line.id !== nextStation.line?.id
              ).length > 0 && (
                <>
                  <HorizontalSpacer />
                  <GreenText>Please change here for</GreenText>
                  <HorizontalSpacer />
                  <OrangeText>the {transferText.en}</OrangeText>
                  <GreenText>.</GreenText>
                </>
              )}
            </TextContainer>
          </InnerContainer>
        </Marquee>
      </Container>
    );
  }

  return (
    <Container>
      <Marquee gradient={false} speed={scrollSpeed}>
        <InnerContainer>
          <TextContainer>
            <GreenText>
              この電車は、{line.nameShort.replace(PARENTHESIS_REGEXP, '')}
            </GreenText>
            <HorizontalSpacer />
            {trainTypeText.ja ? (
              <>
                {isLocal ? (
                  <OrangeText>{trainTypeText.ja}</OrangeText>
                ) : (
                  <CrimsonText>{trainTypeText.ja}</CrimsonText>
                )}
                <HorizontalSpacer />
              </>
            ) : null}
            <OrangeText>{boundText.ja}</OrangeText>
            <OrangeText>行き</OrangeText>
            <GreenText>です。</GreenText>
            <HorizontalSpacer wide />
            <GreenText>
              {`This is the ${line?.nameRoman?.replace(
                PARENTHESIS_REGEXP,
                ''
              )}`}
            </GreenText>
            <HorizontalSpacer />
            {trainTypeText.en ? (
              <>
                {isLocal ? (
                  <OrangeText>{trainTypeText.en}</OrangeText>
                ) : (
                  <CrimsonText>{trainTypeText.en}</CrimsonText>
                )}
                <HorizontalSpacer />
              </>
            ) : null}
            <HorizontalSpacer />
            <GreenText>train for</GreenText>
            <HorizontalSpacer />
            <OrangeText>{boundText.en}</OrangeText>
            <GreenText>.</GreenText>
          </TextContainer>
        </InnerContainer>
      </Marquee>
    </Container>
  );
};

export default MainMarquee;
