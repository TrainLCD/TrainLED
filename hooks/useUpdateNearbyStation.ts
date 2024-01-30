import { ConnectError } from "@connectrpc/connect";
import { createConnectQueryKey, useQuery } from "@connectrpc/connect-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { stationAtom } from "../atoms/station";
import { getStationsByCoordinates } from "../generated/proto/stationapi-StationAPI_connectquery";

const useUpdateNearbyStation = (): {
  isLoading: boolean;
  error: ConnectError | GeolocationPositionError | null;
  update: () => void;
} => {
  const setStation = useSetAtom(stationAtom);
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] =
    useState<GeolocationPositionError | null>(null);

  const queryInput = useMemo(
    () => ({
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      limit: 1,
    }),
    [coords?.latitude, coords?.longitude]
  );

  const {
    data,
    isLoading,
    error: apiError,
  } = useQuery(getStationsByCoordinates, queryInput, { enabled: !!coords });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      setStation((prev) => ({
        ...prev,
        station: data?.stations[0],
      }));
    }
  }, [data, setStation]);

  const update = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords(pos.coords),
      setLocationError,
      {
        enableHighAccuracy: true,
      }
    );
    const queryKey = createConnectQueryKey(getStationsByCoordinates);
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    isLoading,
    error: apiError || locationError,
    update,
  };
};

export default useUpdateNearbyStation;
