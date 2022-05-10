import { ApolloError, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useCallback, useEffect, useState } from "react";
import type { NearbyStationsData, Station } from "../models/StationAPI";

const useFetchNearbyStation = (): [
  Station | undefined,
  (coords: GeolocationCoordinates) => void,
  boolean,
  ApolloError | undefined
] => {
  const [station, setStation] = useState<Station>();

  const NEARBY_STATIONS_TYPE = gql`
    query StationByCoords($latitude: Float!, $longitude: Float!) {
      nearbyStations(latitude: $latitude, longitude: $longitude) {
        id
        groupId
        name
        nameK
        nameR
        nameZh
        nameKo
        address
        distance
        latitude
        longitude
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
      }
    }
  `;

  const [getStation, { loading, error, data }] =
    useLazyQuery<NearbyStationsData>(NEARBY_STATIONS_TYPE, {
      notifyOnNetworkStatusChange: true,
    });
  const fetchStation = useCallback(
    (coords: GeolocationCoordinates | undefined) => {
      if (!coords) {
        return;
      }

      const { latitude, longitude } = coords;

      getStation({
        variables: {
          latitude,
          longitude,
        },
      });
    },
    [getStation]
  );

  useEffect(() => {
    if (!data?.nearbyStations[0]) {
      return;
    }

    setStation(data.nearbyStations[0]);
  }, [data?.nearbyStations, setStation, station]);

  return [station, fetchStation, loading, error];
};

export default useFetchNearbyStation;
