import { useCallback } from "react";

const useCurrentPosition = ({
  onPositionUpdate,
  onPositionError,
}: {
  onPositionUpdate: (position: GeolocationPosition) => void;
  onPositionError?: (error: GeolocationPositionError) => void | null;
}): {
  getCurrentPositionAsync: () => Promise<GeolocationPosition>;
  watchPosition: () => number;
} => {
  const getCurrentPositionAsync = useCallback(
    () =>
      new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        })
      ),
    []
  );

  const watchPosition = useCallback(
    () =>
      navigator.geolocation.watchPosition(onPositionUpdate, onPositionError, {
        enableHighAccuracy: true,
      }),
    [onPositionError, onPositionUpdate]
  );

  return { getCurrentPositionAsync, watchPosition };
};

export default useCurrentPosition;
