import type { Station } from '@/generated/src/proto/stationapi_pb';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { stationAtom } from '../atoms/station';
import {
  MEIJO_LINE_ID,
  MEIJO_LINE_MAJOR_STATIONS_ID,
  OSAKA_LOOP_LINE_MAJOR_STATIONS_ID,
  OSASA_LOOP_LINE_ID,
  YAMANOTE_LINE_ID,
  YAMANOTE_LINE_MAJOR_STATIONS_ID,
} from '../constants';
import { useCurrentLine } from './useCurrentLine';
import { useCurrentStation } from './useCurrentStation';
import useCurrentTrainType from './useCurrentTrainType';

export const useLoopLine = () => {
  const { stations } = useAtomValue(stationAtom);
  const station = useCurrentStation();
  const line = useCurrentLine();
  const trainType = useCurrentTrainType();

  const isYamanoteLine = useMemo(
    (): boolean => line?.id === YAMANOTE_LINE_ID,
    [line?.id]
  );
  const isOsakaLoopLine = useMemo(
    (): boolean => line?.id === OSASA_LOOP_LINE_ID,
    [line?.id]
  );
  const isMeijoLine = useMemo(
    (): boolean => line?.id === MEIJO_LINE_ID,
    [line?.id]
  );

  const isOnlyLoopLine = useMemo(
    () =>
      stations.filter(
        (s) =>
          s.line?.id === YAMANOTE_LINE_ID ||
          s.line?.id === OSASA_LOOP_LINE_ID ||
          s.line?.id === MEIJO_LINE_ID
      ).length === stations.length,
    [stations]
  );

  const majorStationIds = useMemo(() => {
    if (!line) {
      return [];
    }

    if (isYamanoteLine) {
      return YAMANOTE_LINE_MAJOR_STATIONS_ID;
    }

    if (isOsakaLoopLine) {
      return OSAKA_LOOP_LINE_MAJOR_STATIONS_ID;
    }

    if (isMeijoLine) {
      return MEIJO_LINE_MAJOR_STATIONS_ID;
    }

    return [];
  }, [isMeijoLine, isOsakaLoopLine, isYamanoteLine, line]);

  const isLoopLine = useMemo((): boolean => {
    if (!line || trainType || !isOnlyLoopLine) {
      return false;
    }
    return isYamanoteLine || isOsakaLoopLine || isMeijoLine;
  }, [
    isMeijoLine,
    isOnlyLoopLine,
    isOsakaLoopLine,
    isYamanoteLine,
    line,
    trainType,
  ]);

  const inboundStationsForLoopLine = useMemo((): Station[] => {
    if (!line || !station || !isLoopLine) {
      return [];
    }

    const currentStationIndexInBounds = [station.id, ...majorStationIds]
      .sort((a, b) => b - a)
      .findIndex((id) => id === station.id);

    // 配列の途中から走査しているので端っこだと表示されるべき駅が存在しないものとされるので、環状させる
    const leftStations = [...stations, ...stations]
      .slice()
      .reverse()
      .filter((s) => majorStationIds.includes(s.id))
      .slice(currentStationIndexInBounds)
      .filter((s) => s.id !== station.id);
    return leftStations.slice(0, 2);
  }, [isLoopLine, line, majorStationIds, station, stations]);

  const outboundStationsForLoopLine = useMemo((): Station[] => {
    if (!line || !station || !isLoopLine) {
      return [];
    }

    const currentStationIndexInBounds = [station.id, ...majorStationIds]
      .sort((a, b) => a - b)
      .findIndex((id) => id === station.id);

    // 配列の途中から走査しているので端っこだと表示されるべき駅が存在しないものとされるので、環状させる
    const leftStations = [...stations, ...stations]
      .filter((s) => majorStationIds.includes(s.id))
      .slice(currentStationIndexInBounds)
      .filter((s) => s.id !== station.id);
    return leftStations.slice(0, 2);
  }, [isLoopLine, line, majorStationIds, station, stations]);

  return {
    isYamanoteLine,
    isOsakaLoopLine,
    isMeijoLine,
    isLoopLine,
    inboundStationsForLoopLine,
    outboundStationsForLoopLine,
  };
};
