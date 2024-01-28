import { Station, StopCondition } from "../generated/proto/stationapi_pb";

const getIsPass = (station: Station | undefined): boolean => {
  if (!station) {
    return false;
  }

  switch (station.stopCondition) {
    case StopCondition.All:
      return false;
    case StopCondition.Not:
      return true;
    // TrainLEDでは一旦、一時・休日停車等に一旦対応しない
    case StopCondition.Partial:
    case StopCondition.Weekday:
    case StopCondition.Holiday:
      return false;
    default:
      return false;
  }
};

export default getIsPass;
