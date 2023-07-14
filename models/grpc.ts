import {
  Line as LineFromGRPC,
  LineType as LineTypeFromGRPC,
  Station as StationFromGRPC,
} from "../generated/stationapi_pb";

export type Station = StationFromGRPC.AsObject;
export type Line = LineFromGRPC.AsObject;
export const LineType = LineTypeFromGRPC;
