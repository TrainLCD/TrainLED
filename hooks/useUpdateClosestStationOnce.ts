import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { navigationAtom } from "../atoms/navigation";
import geolocationOptions from "../constants/geolocationOptions";

const useUpdateClosestStationOnce = (): {
  update: () => void;
  loading: boolean;
} => {
  const setNavigationAtom = useSetAtom(navigationAtom);
  const [loading, setLoading] = useState(false);

  const update = useCallback(() => {
    setLoading(true);

    const setLocation = (location: GeolocationPosition) => {
      setLoading(false);
      setNavigationAtom((prev) => ({ ...prev, location }));
    };

    navigator.geolocation.getCurrentPosition(
      setLocation,
      null,
      geolocationOptions
    );
  }, [setNavigationAtom]);

  return { update, loading };
};

export default useUpdateClosestStationOnce;
