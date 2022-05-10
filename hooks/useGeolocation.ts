import { useCallback, useEffect } from "react";
import geolocationOptions from "../constants/geolocationOptions";

const useGeolocation = (
  onPositionUpdate?: (position: GeolocationPosition) => void,
  onPositionError?: (error: GeolocationPositionError) => void | null
) => {
  const noop = useCallback(() => undefined, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      onPositionUpdate || noop,
      onPositionError,
      geolocationOptions
    );
  }, [noop, onPositionError, onPositionUpdate]);
};

export default useGeolocation;
