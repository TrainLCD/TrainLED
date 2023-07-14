import { useCallback, useState } from "react";
import { GetStationByLineIdRequest } from "../generated/stationapi_pb";
import { Station } from "../models/grpc";
import useGRPC from "./useGRPC";

const useStationList = (): [
  Station[],
  (lineId: number) => void,
  boolean,
  Error | undefined
] => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const grpcClient = useGRPC();

  const fetchStationListWithTrainTypes = useCallback(
    async (lineId: number) => {
      if (!grpcClient) {
        return;
      }

      try {
        setLoading(true);
        const req = new GetStationByLineIdRequest();
        req.setLineId(lineId);
        const data = (
          await grpcClient?.getStationsByLineId(req, null)
        )?.toObject();
        setStations(data.stationsList);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    },
    [grpcClient]
  );

  return [stations, fetchStationListWithTrainTypes, loading, error];
};

export default useStationList;
