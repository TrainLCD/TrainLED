import { ConnectError } from "@connectrpc/connect";
import { useQuery } from "@connectrpc/connect-query";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import {
  getStationsByLineGroupId,
  getStationsByLineId,
  getTrainTypesByStationId,
} from "../generated/proto/stationapi-StationAPI_connectquery";
import {
  TrainDirection,
  TrainType,
  TrainTypeKind,
} from "../generated/proto/stationapi_pb";
import { findBranchLine, findLocalType } from "../utils/trainTypeString";

const useUpdateStationList = (
  fetchAutomatically = true
): {
  isLoading: boolean;
  error: ConnectError | null;
} => {
  const [{ stations }, setStationState] = useAtom(stationAtom);
  const [{ trainType }, setTrainTypeState] = useAtom(trainTypeAtom);
  const { selectedLine } = useAtomValue(lineAtom);

  const {
    data: trainTypesByStationIdData,
    isLoading: trainTypesByStationIdLoading,
    error: trainTypesByStationIdError,
  } = useQuery(
    getTrainTypesByStationId,
    {
      stationId: selectedLine?.station?.id,
    },
    { enabled: !!selectedLine?.station }
  );

  const {
    data: stationByLineIdData,
    isLoading: stationByLineIdLoading,
    error: stationByLineIdError,
  } = useQuery(
    getStationsByLineId,
    {
      stationId: selectedLine?.station?.id,
      lineId: selectedLine?.id,
    },
    { enabled: !!selectedLine?.station }
  );

  const {
    data: stationsByLineGroupIdData,
    isLoading: stationsByLineGroupIdLoading,
    error: stationsByLineGroupIdError,
  } = useQuery(
    getStationsByLineGroupId,
    { lineGroupId: trainType?.groupId },
    { enabled: !!trainType }
  );

  const fetchTrainTypes = useCallback(async () => {
    const trainTypesList = trainTypesByStationIdData?.trainTypes ?? [];

    // 普通種別が登録済み: 非表示
    // 支線種別が登録されていているが、普通種別が登録されていない: 非表示
    // 特例で普通列車以外の種別で表示を設定されている場合(中央線快速等): 表示
    // 上記以外: 表示
    if (
      !(
        findLocalType(trainTypesList) ||
        (findBranchLine(trainTypesList) && !findLocalType(trainTypesList))
      )
    ) {
      setTrainTypeState((prev) => ({
        ...prev,
        fetchedTrainTypes: [
          new TrainType({
            id: 0,
            typeId: 0,
            groupId: 0,
            name: "普通/各駅停車",
            nameKatakana: "",
            nameRoman: "Local",
            nameChinese: "慢车/每站停车",
            nameKorean: "보통/각역정차",
            color: "",
            lines: [],
            direction: TrainDirection.Both,
            kind: TrainTypeKind.Default,
          }),
          ...trainTypesList,
        ],
      }));
    }

    setTrainTypeState((prev) => ({
      ...prev,
      fetchedTrainTypes: Array.from(
        new Map(
          [
            ...prev.fetchedTrainTypes,
            ...(trainTypesByStationIdData?.trainTypes ?? []),
          ].map((tt) => [tt.id, tt])
        ).values()
      ),
    }));
  }, [setTrainTypeState, trainTypesByStationIdData?.trainTypes]);

  const fetchInitialStationList = useCallback(async () => {
    setStationState((prev) => ({
      ...prev,
      stations: stationByLineIdData?.stations ?? [],
      allStations: stationByLineIdData?.stations ?? [],
    }));

    if (selectedLine?.station?.hasTrainTypes) {
      await fetchTrainTypes();
    }
  }, [
    fetchTrainTypes,
    selectedLine?.station?.hasTrainTypes,
    setStationState,
    stationByLineIdData?.stations,
  ]);

  const fetchSelectedTrainTypeStations = useCallback(async () => {
    setStationState((prev) => ({
      ...prev,
      stations: stationsByLineGroupIdData?.stations ?? [],
      allStations: stationsByLineGroupIdData?.stations ?? [],
    }));
  }, [setStationState, stationsByLineGroupIdData?.stations]);

  useEffect(() => {
    if (!stations.length && fetchAutomatically) {
      fetchInitialStationList();
    }
  }, [fetchAutomatically, fetchInitialStationList, stations.length]);

  useEffect(() => {
    fetchSelectedTrainTypeStations();
  }, [fetchSelectedTrainTypeStations]);

  return {
    isLoading:
      stationByLineIdLoading ??
      trainTypesByStationIdLoading ??
      stationsByLineGroupIdLoading,
    error:
      stationByLineIdError ??
      trainTypesByStationIdError ??
      stationsByLineGroupIdError,
  };
};

export default useUpdateStationList;
