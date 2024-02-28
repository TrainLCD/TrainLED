import { useCallback } from "react";

const useCurrentPosition = ({
  onPositionUpdate,
  onPositionError,
}: {
  onPositionUpdate?: (position: GeolocationPosition) => void;
  onPositionError?: (error: GeolocationPositionError) => void | null;
} = {}): {
  getCurrentPositionAsync: () => Promise<GeolocationPosition>;
  watchPosition: () => number | null;
} => {
  const getCurrentPositionAsync = useCallback(
    () =>
      new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
        })
      ),
    []
  );

  const watchPosition = useCallback(
    () =>
      (onPositionUpdate &&
        navigator.geolocation.watchPosition(onPositionUpdate, onPositionError, {
          enableHighAccuracy: true,
        })) ??
      null,
    [onPositionError, onPositionUpdate]
  );

  return { getCurrentPositionAsync, watchPosition };
};

export default useCurrentPosition;
