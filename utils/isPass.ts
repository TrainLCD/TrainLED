import dayjs from "dayjs";
import { Station, StopCondition } from "../generated/proto/stationapi_pb";

const isHoliday = ((): boolean => dayjs().day() === 0 || dayjs().day() === 6)();

export const getIsPass = (station: Station | null): boolean => {
  if (!station) {
    return false;
  }

  switch (station.stopCondition) {
    case StopCondition.All:
    case StopCondition.PartialStop: // 一部停車は一旦停車扱い
    case StopCondition.Partial: // 一部通過は停車扱い
      return false;
    case StopCondition.Not:
      return true;
    case StopCondition.Weekday:
      // 若干分かりづらい感じはするけど休日に飛ばすという意味
      return isHoliday;
    case StopCondition.Holiday:
      return !isHoliday;
    default:
      return false;
  }
};
