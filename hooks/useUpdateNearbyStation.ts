"use client";
import { ConnectError } from "@connectrpc/connect";
import { createConnectQueryKey, useQuery } from "@connectrpc/connect-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useAsyncFn } from "react-use";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { getStationsByCoordinates } from "../generated/proto/stationapi-StationAPI_connectquery";
import useCurrentPosition from "./useCurrentPosition";

const useUpdateNearbyStation = (): {
  isLoading: boolean;
  error: ConnectError | Error | null;
  update: () => void;
} => {
  const [{ station }, setStation] = useAtom(stationAtom);
  const [{ location }, setNavigationAtom] = useAtom(navigationAtom);

  const { getCurrentPositionAsync } = useCurrentPosition();

  const {
    data,
    isLoading: isByCoordsLoading,
    error: apiError,
    refetch,
  } = useQuery(
    getStationsByCoordinates,
    {
      latitude: location?.coords.latitude,
      longitude: location?.coords?.longitude,
      limit: 1,
    },
    { enabled: !!location?.coords && !station }
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

  const [{ loading: isUpdateLoading, error: updateError }, update] =
    useAsyncFn(async () => {
      const newPos = await getCurrentPositionAsync();
      setNavigationAtom((prev) => ({ ...prev, location: newPos }));

      const queryKey = createConnectQueryKey(getStationsByCoordinates);
      await queryClient.invalidateQueries({ queryKey });
      await refetch();

      return Promise.resolve();
    }, [getCurrentPositionAsync, queryClient, refetch, setNavigationAtom]);

  useEffect(() => {
    if (!station) {
      update();
    }
  }, [station, update]);

  return {
    isLoading: isByCoordsLoading || isUpdateLoading,
    error: (apiError || updateError) ?? null,
    update,
  };
};

export default useUpdateNearbyStation;
