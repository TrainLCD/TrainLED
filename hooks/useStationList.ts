import { ApolloError, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useCallback, useEffect, useState } from "react";
import type { Station, StationsByLineIdData } from "../models/StationAPI";

const useStationList = (): [
  Station[],
  (lineId: number) => void,
  boolean,
  ApolloError | undefined
] => {
  const [stations, setStations] = useState<Station[]>([]);
  const STATIONS_BY_LINE_ID_TYPE = gql`
    query StationsByLineId($lineId: ID!) {
      stationsByLineId(lineId: $lineId) {
        id
        groupId
        name
        nameK
        nameR
        nameZh
        nameKo
        address
        latitude
        longitude
        fullStationNumber
        secondaryFullStationNumber
        extraFullStationNumber
        lines {
          id
          companyId
          lineColorC
          name
          nameR
          nameK
          nameZh
          nameKo
          lineType
        }
        trainTypes {
          id
          typeId
          groupId
          name
          nameR
          nameZh
          nameKo
          color
          lines {
            id
            name
            nameR
            nameK
            lineColorC
            companyId
            company {
              nameR
              nameEn
            }
          }
          allTrainTypes {
            id
            groupId
            typeId
            name
            nameK
            nameR
            nameZh
            nameKo
            color
            line {
              id
              name
              nameR
              lineColorC
            }
          }
        }
      }
    }
  `;

  const [getStations, { loading, error, data }] =
    useLazyQuery<StationsByLineIdData>(STATIONS_BY_LINE_ID_TYPE, {
      notifyOnNetworkStatusChange: true,
    });

  const fetchStationListWithTrainTypes = useCallback(
    (lineId: number) => {
      getStations({
        variables: {
          lineId,
        },
      });
    },
    [getStations]
  );

  useEffect(() => {
    if (data?.stationsByLineId?.length) {
      setStations(data.stationsByLineId);
    }
  }, [data, setStations]);

  return [stations, fetchStationListWithTrainTypes, loading, error];
};

export default useStationList;
