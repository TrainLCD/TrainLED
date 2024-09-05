import { PREFECTURES_JA, PREFECTURES_ROMAN } from "../constants";
import { Station } from "../generated/proto/stationapi_pb";

export const groupStations = (stations: Station[]): Station[] => {
  return stations
    .filter(
      (sta, idx, arr) => arr.findIndex((s) => s.groupId === sta.groupId) === idx
    )
    .map((sta, idx, arr) => {
      // 駅名が同じだが都道府県は違う場合は都道府県名を付与する
      if (
        arr.some(
          (s) => s.prefectureId !== sta.prefectureId && s.name === sta.name
        )
      ) {
        return new Station({
          ...sta,
          name: `${sta.name}(${PREFECTURES_JA[sta.prefectureId - 1]})`,
          nameRoman: `${sta.nameRoman}(${
            PREFECTURES_ROMAN[sta.prefectureId - 1]
          })`,
        });
      }
      // 駅名が同じだが運営会社は違う場合は事業者名を付与する
      if (
        arr.some(
          (s) =>
            s.line?.company?.id !== sta.line?.company?.id && s.name === sta.name
        )
      ) {
        return new Station({
          ...sta,
          name: `${sta.name}(${sta.line?.company?.nameShort})`,
          nameRoman: `${sta.nameRoman}(${sta.line?.company?.nameEnglishShort})`,
        });
      }

      return sta;
    });
};
