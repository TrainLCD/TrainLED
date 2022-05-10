import { Station, StopCondition } from "../models/StationAPI";

const getIsPass = (station: Station | undefined): boolean => {
  if (!station) {
    return false;
  }

  switch (station.stopCondition) {
    case StopCondition.ALL:
      return false;
    case StopCondition.NOT:
      return true;
    // TrainLEDでは一旦、一時・休日停車等に一旦対応しない
    case StopCondition.PARTIAL:
    case StopCondition.WEEKDAY:
    case StopCondition.HOLIDAY:
      return false;
    default:
      return false;
  }
};

export default getIsPass;
