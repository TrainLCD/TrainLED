import type { Station } from '@/generated/src/proto/stationapi_pb';

export const getCurrentStationIndex = (
  stations: Station[],
  nearestStation: Station | null
): number =>
  stations.findIndex((s) =>
    s.line?.id === 99301 // NOTE: 99301 = 都営大江戸線
      ? // NOTE: 都営大江戸線はname判定をすると都庁前駅でずれるので特別比較しないようにしている
        s.groupId === nearestStation?.groupId
      : s.name === nearestStation?.name || s.groupId === nearestStation?.groupId
  );
