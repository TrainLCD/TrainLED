import { useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { navigationAtom } from "../atoms/navigation";
import useCurrentPosition from "../hooks/useCurrentPosition";

export const useUpdateLocation = () => {
  const setNavigationAtom = useSetAtom(navigationAtom);

  const handlePositionUpdate = useCallback(
    (location: GeolocationPosition) => {
      setNavigationAtom((prev) => ({ ...prev, location }));
    },
    [setNavigationAtom]
  );

  const { watchPosition } = useCurrentPosition({
    onPositionUpdate: handlePositionUpdate,
  });

  useEffect(() => {
    const watchId = watchPosition();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchPosition]);
};
