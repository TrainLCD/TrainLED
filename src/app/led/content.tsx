'use client';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { navigationAtom } from '../../atoms/navigation';
import Container from '../../components/Container';
import HorizontalSpacer from '../../components/HorizontalSpacer';
import MainMarquee from '../../components/MainMarquee';
import MainTopText from '../../components/MainTopText';
import { useUpdateLocation } from '../../components/useUpdateLocation';
import { useAfterNextStation } from '../../hooks/useAfterNextStation';
import { useAutoMode } from '../../hooks/useAutoMode';
import useCurrentLanguageState from '../../hooks/useCurrentLanguageState';
import { useCurrentLine } from '../../hooks/useCurrentLine';
import { useNextStation } from '../../hooks/useNextStation';
import { useRefreshStation } from '../../hooks/useRefreshStation';

export const PageContent = () => {
  const { autoModeEnabled } = useAtomValue(navigationAtom);

  const currentLine = useCurrentLine();
  const nextStation = useNextStation();
  const afterNextStation = useAfterNextStation();
  const langState = useCurrentLanguageState();
  const router = useRouter();

  useUpdateLocation();
  useRefreshStation();
  useAutoMode(autoModeEnabled);

  useEffect(() => {
    if (!currentLine) {
      router.replace('/');
    }
  }, [currentLine, router]);

  if (!currentLine) {
    return null;
  }

  return (
    <Container fullHeight>
      <MainTopText nextStation={nextStation} language={langState} />
      <HorizontalSpacer />
      <MainMarquee
        nextStation={nextStation}
        afterNextStation={afterNextStation}
        line={currentLine}
      />
    </Container>
  );
};
