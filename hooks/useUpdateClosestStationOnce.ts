import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { navigationAtom } from "../atoms/navigation";
import geolocationOptions from "../constants/geolocationOptions";
import useProcessLocation from "./useProcessLocation";

const useUpdateClosestStationOnce = (): { update: () => void } => {
  const setNavigationAtom = useSetAtom(navigationAtom);
  useProcessLocation();

  const update = useCallback(() => {
    const setLocation = (location: GeolocationPosition) =>
      setNavigationAtom((prev) => ({ ...prev, location }));

    navigator.geolocation.getCurrentPosition(
      setLocation,
      null,
      geolocationOptions
    );
  }, [setNavigationAtom]);

  return { update };
};

export default useUpdateClosestStationOnce;
