import { useCallback } from "react";
import { Line, Station } from "../generated/proto/stationapi_pb";

export const useStationNumberIndex = () =>
  useCallback((station: Station | undefined, line?: Line) => {
    return (
      line?.lineSymbols?.findIndex(({ symbol }) =>
        station?.stationNumbers?.some(({ lineSymbol }) => symbol === lineSymbol)
      ) ?? 0
    );
  }, []);
