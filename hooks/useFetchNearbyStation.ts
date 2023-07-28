import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { GetStationByCoordinatesRequest } from "../generated/stationapi_pb";
import useCurrentPosition from "./useCurrentPosition";
import useGRPC from "./useGRPC";

const useFetchNearbyStation = (): [
  boolean,
  GeolocationPositionError | null
] => {
  const [{ station }, setStation] = useAtom(stationAtom);
  const [{ loading }, setNavigationAtom] = useAtom(navigationAtom);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  const grpcClient = useGRPC();

  const fetchStation = useCallback(
    async (coords: GeolocationCoordinates | undefined) => {
      if (!coords || !!station) {
        return;
      }

      setNavigationAtom((prev) => ({ ...prev, loading: true }));

      try {
        const { latitude, longitude } = coords;
        const req = new GetStationByCoordinatesRequest();
        req.setLatitude(latitude);
        req.setLongitude(longitude);
        req.setLimit(1);
        const data = (
          await grpcClient?.getStationsByCoordinates(req, null)
        )?.toObject();
        setStation((prev) => ({
          ...prev,
          station: data?.stationsList[0] || null,
        }));
        setNavigationAtom((prev) => ({ ...prev, loading: false }));
      } catch (err) {
        setError(err as GeolocationPositionError);
        setNavigationAtom((prev) => ({ ...prev, loading: false }));
      }
    },
    [grpcClient, setNavigationAtom, setStation, station]
  );

  const handlePositionUpdate = useCallback(
    (pos: GeolocationPosition) => {
      fetchStation(pos.coords);
    },
    [fetchStation]
  );

  useCurrentPosition({
    enableAutoFetch: true,
    onPositionUpdate: handlePositionUpdate,
  });

  return [loading, error];
};

export default useFetchNearbyStation;
