import { ConnectError } from "@connectrpc/connect";
import { useQuery } from "@connectrpc/connect-query";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { stationAtom } from "../atoms/station";
import { getStationsByCoordinates } from "../generated/proto/stationapi-StationAPI_connectquery";

const useUpdateNearbyStation = (): {
  isLoading: boolean;
  error: ConnectError | GeolocationPositionError | null;
} => {
  const [{ station: stationFromState }, setStation] = useAtom(stationAtom);
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] =
    useState<GeolocationPositionError | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords(pos.coords),
      setLocationError,
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  const {
    data,
    isLoading,
    error: apiError,
  } = useQuery(
    getStationsByCoordinates,
    {
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      limit: 1,
    },
    {
      enabled: !!coords && !stationFromState,
    }
  );

  useEffect(() => {
    if (data) {
      setStation((prev) => ({
        ...prev,
        station: data?.stations[0],
      }));
    }
  }, [data, setStation]);

  return {
    isLoading,
    error: apiError || locationError,
  };
};

export default useUpdateNearbyStation;
