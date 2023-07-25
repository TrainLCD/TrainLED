import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { navigationAtom } from "../atoms/navigation";
import useCurrentPosition from "./useCurrentPosition";

const useUpdateClosestStationOnce = (): {
  update: () => void;
  loading: boolean;
} => {
  const setNavigationAtom = useSetAtom(navigationAtom);
  const [loading, setLoading] = useState(false);

  const setLocation = useCallback(
    (location: GeolocationPosition) => {
      setLoading(false);
      setNavigationAtom((prev) => ({ ...prev, location }));
    },
    [setNavigationAtom]
  );

  const { fetchCurrentPosition } = useCurrentPosition({
    onPositionUpdate: setLocation,
  });

  const update = useCallback(() => {
    setLoading(true);
    fetchCurrentPosition();
  }, [fetchCurrentPosition]);

  return { update, loading };
};

export default useUpdateClosestStationOnce;
