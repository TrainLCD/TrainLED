import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { navigationAtom } from "../atoms/navigation";
import geolocationOptions from "../constants/geolocationOptions";

const useUpdateClosestStationOnce = () => {
  const setNavigationAtom = useSetAtom(navigationAtom);

  useEffect(() => {
    const setLocation = (location: GeolocationPosition) =>
      setNavigationAtom((prev) => ({ ...prev, location }));

    navigator.geolocation.getCurrentPosition(
      setLocation,
      null,
      geolocationOptions
    );
  }, [setNavigationAtom]);
};

export default useUpdateClosestStationOnce;
