import { useCallback, useEffect } from "react";
import geolocationOptions from "../constants/geolocationOptions";

const useCurrentPosition = ({
  enableAutoFetch = false,
  onPositionUpdate,
  onPositionError,
}: {
  enableAutoFetch?: boolean;
  onPositionUpdate: (position: GeolocationPosition) => void;
  onPositionError?: (error: GeolocationPositionError) => void | null;
}): { fetchCurrentPosition: () => void; watchPosition: () => number } => {
  const noop = useCallback(() => undefined, []);

  const fetchCurrentPosition = useCallback(
    () =>
      navigator.geolocation.getCurrentPosition(
        onPositionUpdate || noop,
        onPositionError,
        geolocationOptions
      ),
    [noop, onPositionError, onPositionUpdate]
  );

  const watchPosition = useCallback(
    () =>
      navigator.geolocation.watchPosition(
        onPositionUpdate || noop,
        onPositionError,
        geolocationOptions
      ),
    [noop, onPositionError, onPositionUpdate]
  );

  useEffect(() => {
    if (!enableAutoFetch) {
      return;
    }
    fetchCurrentPosition();
  }, [enableAutoFetch, fetchCurrentPosition]);

  return { fetchCurrentPosition, watchPosition };
};

export default useCurrentPosition;
