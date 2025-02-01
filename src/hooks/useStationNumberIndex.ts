import type { Line, Station } from '@/generated/src/proto/stationapi_pb';
import { useCallback } from 'react';

export const useStationNumberIndex = () =>
  useCallback((station: Station | undefined, line?: Line) => {
    return (
      line?.lineSymbols?.findIndex(({ symbol }) =>
        station?.stationNumbers?.some(({ lineSymbol }) => symbol === lineSymbol)
      ) ?? 0
    );
  }, []);
