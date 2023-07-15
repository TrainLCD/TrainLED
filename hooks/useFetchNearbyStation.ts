import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { stationAtom } from "../atoms/station";
import { GetStationByCoordinatesRequest } from "../generated/stationapi_pb";
import useGRPC from "./useGRPC";
import useGeolocation from "./useGeolocation";

const useFetchNearbyStation = (): [
  boolean,
  GeolocationPositionError | null
] => {
  const [{ station }, setStation] = useAtom(stationAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  const grpcClient = useGRPC();

  const fetchStation = useCallback(
    async (coords: GeolocationCoordinates | undefined) => {
      if (!coords || !!station) {
        return;
      }

      setLoading(true);

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
        setLoading(false);
      } catch (err) {
        setError(err as GeolocationPositionError);
        setLoading(false);
      }
    },
    [grpcClient, setStation, station]
  );

  const onLocation = useCallback(
    (pos: GeolocationPosition) => {
      fetchStation(pos.coords);
    },
    [fetchStation]
  );

  useGeolocation(onLocation, setError);

  return [loading, error];
};

export default useFetchNearbyStation;
