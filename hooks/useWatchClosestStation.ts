import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { navigationAtom } from "../atoms/navigation";
import geolocationOptions from "../constants/geolocationOptions";

const useWatchClosestStation = () => {
  const setNavigationAtom = useSetAtom(navigationAtom);

  useEffect(() => {
    const setLocation = (location: GeolocationPosition) =>
      setNavigationAtom((prev) => ({ ...prev, location }));

    const watchingId = navigator.geolocation.watchPosition(
      setLocation,
      null, // FIXME: エラー処理実装
      geolocationOptions
    );

    return () => navigator.geolocation.clearWatch(watchingId);
  }, [setNavigationAtom]);
};

export default useWatchClosestStation;
