import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import {
  GetStationByLineIdRequest,
  GetStationsByLineGroupIdRequest,
  GetTrainTypesByStationIdRequest,
  TrainDirection,
} from "../generated/stationapi_pb";
import {
  findBranchLine,
  findLocalType,
  getTrainTypeString,
} from "../utils/trainTypeString";
import useGRPC from "./useGRPC";

const useStationList = (): {
  fetchSelectedTrainTypeStations: () => Promise<void>;
  loading: boolean;
  error: Error | null;
} => {
  const [{ station }, setStationState] = useAtom(stationAtom);
  const [{ trainType, fetchedTrainTypes }, setTrainTypeAtom] =
    useAtom(trainTypeAtom);
  const { selectedLine } = useAtomValue(lineAtom);
  const grpcClient = useGRPC();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrainTypes = useCallback(async () => {
    try {
      if (!selectedLine?.station?.id) {
        return;
      }

      setLoading(true);

      const req = new GetTrainTypesByStationIdRequest();
      req.setStationId(selectedLine.station.id);
      const trainTypesRes = (
        await grpcClient?.getTrainTypesByStationId(req, null)
      )?.toObject();

      // 普通種別が登録済み: 非表示
      // 支線種別が登録されていているが、普通種別が登録されていない: 非表示
      // 特例で普通列車以外の種別で表示を設定されている場合(中央線快速等): 表示
      // 上記以外: 表示
      if (
        !(
          findLocalType(trainTypesRes?.trainTypesList ?? []) ||
          (findBranchLine(trainTypesRes?.trainTypesList ?? []) &&
            !findLocalType(trainTypesRes?.trainTypesList ?? [])) ||
          getTrainTypeString(selectedLine, station) !== "local"
        )
      ) {
        setTrainTypeAtom((prev) => ({
          ...prev,
          fetchedTrainTypes: [
            {
              id: 0,
              typeId: 0,
              groupId: 0,
              name: "普通/各駅停車",
              nameKatakana: "",
              nameRoman: "Local",
              nameChinese: "慢车/每站停车",
              nameKorean: "보통/각역정차",
              color: "",
              linesList: [],
              direction: TrainDirection.BOTH,
            },
          ],
        }));
      }
      setTrainTypeAtom((prev) => ({
        ...prev,
        trainType: trainTypesRes?.trainTypesList[0] ?? null,
        fetchedTrainTypes: [
          ...prev.fetchedTrainTypes,
          ...(trainTypesRes?.trainTypesList ?? []),
        ],
      }));

      setLoading(false);
    } catch (err) {
      setError(err as any);
      setLoading(false);
    }
  }, [grpcClient, selectedLine, setTrainTypeAtom, station]);

  const fetchInitialStationList = useCallback(async () => {
    const lineId = selectedLine?.id;
    if (!lineId) {
      return;
    }

    try {
      setLoading(true);

      const req = new GetStationByLineIdRequest();
      req.setLineId(lineId);
      const data = (
        await grpcClient?.getStationsByLineId(req, null)
      )?.toObject();

      if (!data) {
        setLoading(false);
        return;
      }

      if (station?.hasTrainTypes) {
        await fetchTrainTypes();
        setLoading(false);
        return;
      }

      setStationState((prev) => ({
        ...prev,
        stations: data.stationsList,
      }));

      setLoading(false);
    } catch (err) {
      setError(err as any);
      setLoading(false);
    }
  }, [
    fetchTrainTypes,
    grpcClient,
    selectedLine?.id,
    setStationState,
    station?.hasTrainTypes,
  ]);

  const fetchSelectedTrainTypeStations = useCallback(async () => {
    if (!trainType?.groupId || !fetchedTrainTypes.length) {
      return;
    }
    setLoading(true);

    try {
      const req = new GetStationsByLineGroupIdRequest();
      req.setLineGroupId(trainType?.groupId);
      const data = (
        await grpcClient?.getStationsByLineGroupId(req, null)
      )?.toObject();

      if (!data) {
        setLoading(false);
        return;
      }

      setStationState((prev) => ({
        ...prev,
        stations: data.stationsList,
      }));
      setTrainTypeAtom((prev) => ({ ...prev }));

      setLoading(false);
    } catch (err) {
      setError(err as any);
      setLoading(false);
    }
  }, [
    fetchedTrainTypes.length,
    grpcClient,
    setStationState,
    setTrainTypeAtom,
    trainType?.groupId,
  ]);

  useEffect(() => {
    if (!fetchedTrainTypes.length) {
      fetchInitialStationList();
    }
  }, [fetchInitialStationList, fetchedTrainTypes.length]);

  return {
    fetchSelectedTrainTypeStations,
    loading,
    error,
  };
};

export default useStationList;
