import type { Line, Station } from '@/generated/src/proto/stationapi_pb';

const YAMANOTE_LINE_MAJOR_STATIONS_ID = [
  1130205, // 渋谷
  1130208, // 新宿
  1130212, // 池袋
  1130220, // 上野
  1130224, // 東京
  1130229, // 品川
];

const OSAKA_LOOP_LINE_MAJOR_STATIONS_ID = [
  1162310, // 大阪
  1162307, // 西九条
  1162302, // 新今宮
  1162301, // 天王寺
  1162317, // 鶴橋
  1162313, // 京橋
];

const MEIJO_LINE_MAJOR_STATIONS_ID = [
  9951409, // 栄
  9951402, // 大曽根
  9951407, // 名古屋城
  9951413, // 金山
  9951419, // 新瑞橋
];

export const getIsYamanoteLine = (lineId: number): boolean => lineId === 11302;
export const getIsOsakaLoopLine = (lineId: number): boolean => lineId === 11623;
export const getIsMeijoLine = (lineId: number): boolean => lineId === 99514;

const getMajorStationIds = (line: Line) => {
  if (getIsYamanoteLine(line.id)) {
    return YAMANOTE_LINE_MAJOR_STATIONS_ID;
  }

  if (getIsOsakaLoopLine(line.id)) {
    return OSAKA_LOOP_LINE_MAJOR_STATIONS_ID;
  }

  if (getIsMeijoLine(line.id)) {
    return MEIJO_LINE_MAJOR_STATIONS_ID;
  }

  return [];
};

export const getIsLoopLine = (
  line: Line | null | undefined,
  trainType: unknown
): boolean => {
  if (!line || trainType) {
    return false;
  }
  return (
    getIsYamanoteLine(line.id) ||
    getIsOsakaLoopLine(line.id) ||
    getIsMeijoLine(line.id)
  );
};

export const inboundStationsForLoopLine = (
  stations: Station[],
  station: Station | null,
  selectedLine: Line | null
): Station[] => {
  if (!selectedLine || !station || !getIsLoopLine(selectedLine, null)) {
    return [];
  }

  const majorStationIds = getMajorStationIds(selectedLine);

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
};

export const outboundStationsForLoopLine = (
  stations: Station[],
  station: Station,
  selectedLine: Line | null
): Station[] => {
  if (!selectedLine || !station || !getIsLoopLine(selectedLine, null)) {
    return [];
  }

  const majorStationIds = getMajorStationIds(selectedLine);

  const currentStationIndexInBounds = [station.id, ...majorStationIds]
    .sort((a, b) => a - b)
    .findIndex((id) => id === station.id);

  // 配列の途中から走査しているので端っこだと表示されるべき駅が存在しないものとされるので、環状させる
  const leftStations = [...stations, ...stations]
    .filter((s) => majorStationIds.includes(s.id))
    .slice(currentStationIndexInBounds)
    .filter((s) => s.id !== station.id);
  return leftStations.slice(0, 2);
};
