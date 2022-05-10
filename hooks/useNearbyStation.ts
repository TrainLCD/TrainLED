import { useCallback, useEffect, useState } from "react";
import { Station } from "../models/StationAPI";
import useFetchNearbyStation from "./useFetchNearbyStation";
import useGeolocation from "./useGeolocation";

const useNearbyStation = (): [Station | undefined, boolean, boolean] => {
  const [station, fetchStation, stationLoading, stationLoadingError] =
    useFetchNearbyStation();

  const [hasError, setHasError] = useState<boolean>(false);
  const onLocation = useCallback(
    (position: GeolocationPosition) => {
      fetchStation(position.coords);
    },
    [fetchStation]
  );
  const onLocationError = useCallback(() => setHasError(true), []);

  useEffect(() => {
    if (stationLoadingError) {
      setHasError(true);
    }
  }, [stationLoadingError]);

  useGeolocation(onLocation, onLocationError);

  return [station, stationLoading, hasError];
};

export default useNearbyStation;
