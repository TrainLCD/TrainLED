import { ConnectError } from "@connectrpc/connect";
import { createConnectQueryKey, useQuery } from "@connectrpc/connect-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { stationAtom } from "../atoms/station";
import { getStationsByCoordinates } from "../generated/proto/stationapi-StationAPI_connectquery";
import useCurrentPosition from "./useCurrentPosition";

const useUpdateNearbyStation = (): {
  isLoading: boolean;
  error: ConnectError | GeolocationPositionError | null;
  update: () => void;
} => {
  const [{ station }, setStation] = useAtom(stationAtom);
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);

  const { getCurrentPositionAsync } = useCurrentPosition();

  const {
    data,
    isLoading,
    error: apiError,
    refetch,
  } = useQuery(
    getStationsByCoordinates,
    {
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      limit: 1,
    },
    { enabled: !!coords && !station }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      setStation((prev) => ({
        ...prev,
        station: data?.stations[0],
      }));
    }
  }, [data, setStation]);

  const update = useCallback(async () => {
    const newPos = await getCurrentPositionAsync();
    setCoords(newPos.coords);

    const queryKey = createConnectQueryKey(getStationsByCoordinates);
    await queryClient.invalidateQueries({ queryKey });
    await refetch();
  }, [getCurrentPositionAsync, queryClient, refetch]);

  useEffect(() => {
    if (!station) {
      update();
    }
  }, [station, update]);

  return {
    isLoading,
    error: apiError,
    update,
  };
};

export default useUpdateNearbyStation;
