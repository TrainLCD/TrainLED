import {
  Line as LineFromGRPC,
  LineType as LineTypeFromGRPC,
  Station as StationFromGRPC,
  TrainType as TrainTypeGRPC,
} from "../generated/stationapi_pb";

export type Station = StationFromGRPC.AsObject;
export type Line = LineFromGRPC.AsObject;
export type TrainType = TrainTypeGRPC.AsObject;

export const LineType = LineTypeFromGRPC;
