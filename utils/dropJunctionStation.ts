import { Station } from "../generated/proto/stationapi_pb";
import { LineDirection } from "../models/bound";

// ２路線の接続駅は前の路線の最後の駅データを捨てる
export const dropEitherJunctionStation = (
  stations: Station[],
  direction?: LineDirection | null
): Station[] =>
  stations.filter((s, i, arr): boolean => {
    const station = direction === "INBOUND" ? arr[i - 1] : arr[i + 1];
    return station?.groupId !== s.groupId;
  });
