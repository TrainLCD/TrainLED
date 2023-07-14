import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { stationAtom } from "../atoms/station";
import { GetStationByCoordinatesRequest } from "../generated/stationapi_pb";
import useGRPC from "./useGRPC";
import useGeolocation from "./useGeolocation";

const useNearbyStation = (): [boolean, GeolocationPositionError | null] => {
  const setStation = useSetAtom(stationAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  const grpcClient = useGRPC();

  const fetchStation = useCallback(
    async (coords: GeolocationCoordinates | undefined) => {
      if (!coords || !grpcClient) {
        return;
      }
      try {
        const { latitude, longitude } = coords;
        const req = new GetStationByCoordinatesRequest();
        req.setLatitude(latitude);
        req.setLongitude(longitude);
        req.setLimit(1);
        setLoading(true);
        const data = (
          await grpcClient?.getStationsByCoordinates(req, null)
        )?.toObject();
        setLoading(false);
        setStation((prev) => ({
          ...prev,
          station: data.stationsList[0] || null,
        }));
      } catch (err) {
        setError(err as GeolocationPositionError);
        setLoading(false);
      }
    },
    [grpcClient, setStation]
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

export default useNearbyStation;
