import { useAtom } from "jotai";
import { useCallback } from "react";
import { navigationAtom } from "../atoms/navigation";
import useCurrentPosition from "./useCurrentPosition";

const useUpdateClosestStationOnce = (): {
  update: () => void;
  loading: boolean;
} => {
  const [{ loading }, setNavigationAtom] = useAtom(navigationAtom);

  const setLocation = useCallback(
    (location: GeolocationPosition) => {
      setNavigationAtom((prev) => ({ ...prev, location, loading: false }));
    },
    [setNavigationAtom]
  );

  const { fetchCurrentPosition } = useCurrentPosition({
    onPositionUpdate: setLocation,
  });

  const update = useCallback(() => {
    setNavigationAtom((prev) => ({ ...prev, loading: true }));
    fetchCurrentPosition();
  }, [fetchCurrentPosition, setNavigationAtom]);

  return { update, loading };
};

export default useUpdateClosestStationOnce;
