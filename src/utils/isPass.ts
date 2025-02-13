import {
  type Station,
  StopCondition,
} from '@/generated/src/proto/stationapi_pb';
import { isHoliday } from './holiday';

const getIsPass = (
  station: Station | null,
  ignoreDayCondition?: boolean
): boolean => {
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
      return ignoreDayCondition || isHoliday();
    case StopCondition.Holiday:
      return ignoreDayCondition || !isHoliday();
    default:
      return false;
  }
};

export default getIsPass;
