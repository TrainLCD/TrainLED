import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { navigationAtom } from "../atoms/navigation";
import geolocationOptions from "../constants/geolocationOptions";
import useProcessLocation from "./useProcessLocation";

const useWatchClosestStation = (paused = true) => {
  const setNavigationAtom = useSetAtom(navigationAtom);
  useProcessLocation();

  useEffect(() => {
    if (paused) {
      return;
    }

    const setLocation = (location: GeolocationPosition) =>
      setNavigationAtom((prev) => ({ ...prev, location }));

    const watchingId = navigator.geolocation.watchPosition(
      setLocation,
      null, // FIXME: エラー処理実装
      geolocationOptions
    );

    return () => navigator.geolocation.clearWatch(watchingId);
  }, [paused, setNavigationAtom]);
};

export default useWatchClosestStation;
