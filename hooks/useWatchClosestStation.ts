import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { navigationAtom } from "../atoms/navigation";
import useCurrentPosition from "./useCurrentPosition";

const useWatchClosestStation = () => {
  const setNavigationAtom = useSetAtom(navigationAtom);

  const handlePositionUpdate = (location: GeolocationPosition) =>
    setNavigationAtom((prev) => ({ ...prev, location }));

  const { watchPosition } = useCurrentPosition({
    onPositionUpdate: handlePositionUpdate,
  });

  useEffect(() => {
    const watchingId = watchPosition();

    return () => navigator.geolocation.clearWatch(watchingId);
  }, [watchPosition]);
};

export default useWatchClosestStation;
