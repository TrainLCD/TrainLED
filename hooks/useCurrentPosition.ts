import { useCallback, useEffect } from "react";

const useCurrentPosition = ({
  enableAutoFetch = false,
  onPositionUpdate,
  onPositionError,
}: {
  enableAutoFetch?: boolean;
  onPositionUpdate: (position: GeolocationPosition) => void;
  onPositionError?: (error: GeolocationPositionError) => void | null;
}): { fetchCurrentPosition: () => void; watchPosition: () => number } => {
  const fetchCurrentPosition = useCallback(
    () =>
      navigator.geolocation.getCurrentPosition(
        onPositionUpdate,
        onPositionError,
        { enableHighAccuracy: true }
      ),
    [onPositionError, onPositionUpdate]
  );

  const watchPosition = useCallback(
    () =>
      navigator.geolocation.watchPosition(onPositionUpdate, onPositionError, {
        enableHighAccuracy: true,
      }),
    [onPositionError, onPositionUpdate]
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
