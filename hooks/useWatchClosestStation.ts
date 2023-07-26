import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import useCurrentPosition from "./useCurrentPosition";

const useWatchClosestStation = () => {
  const { selectedBound } = useAtomValue(stationAtom);
  const setNavigationAtom = useSetAtom(navigationAtom);
  const watchingIdRef = useRef<number | null>(null);

  const handlePositionUpdate = useCallback(
    (location: GeolocationPosition) =>
      setNavigationAtom((prev) => ({ ...prev, location })),
    [setNavigationAtom]
  );

  const { watchPosition } = useCurrentPosition({
    onPositionUpdate: handlePositionUpdate,
  });

  useEffect(() => {
    if (!watchingIdRef.current && selectedBound) {
      watchingIdRef.current = watchPosition();
    }

    return () => navigator.geolocation.clearWatch(watchingIdRef.current ?? 1);
  }, [selectedBound, watchPosition]);
};

export default useWatchClosestStation;
