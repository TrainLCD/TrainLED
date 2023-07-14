import { useCallback, useState } from "react";
import { GetStationByCoordinatesRequest } from "../generated/stationapi_pb";
import { Station } from "../models/grpc";
import useGRPC from "./useGRPC";
import useGeolocation from "./useGeolocation";

const useNearbyStation = (): [
  Station | null,
  boolean,
  GeolocationPositionError | null
] => {
  const [station, setStation] = useState<Station | null>(null);
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
        setStation(data.stationsList[0]);
      } catch (err) {
        setError(err as GeolocationPositionError);
        setLoading(false);
      }
    },
    [grpcClient]
  );

  const onLocation = useCallback(
    (pos: GeolocationPosition) => {
      fetchStation(pos.coords);
    },
    [fetchStation]
  );

  useGeolocation(onLocation, setError);

  return [station, loading, error];
};

export default useNearbyStation;
