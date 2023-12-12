import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { lineAtom } from "../atoms/line";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import {
  GetStationByLineIdRequest,
  GetStationsByLineGroupIdRequest,
  GetTrainTypesByStationIdRequest,
  TrainDirection,
  TrainTypeKind,
} from "../generated/stationapi_pb";
import dropEitherJunctionStation from "../utils/dropJunctionStation";
import {
  findBranchLine,
  findLocalType,
  findLtdExpType,
  findRapidType,
  getTrainTypeString,
} from "../utils/trainTypeString";
import useGRPC from "./useGRPC";

const useStationList = (): {
  fetchSelectedTrainTypeStations: () => Promise<void>;
  loading: boolean;
  error: Error | null;
} => {
  const [{ station }, setStationAtom] = useAtom(stationAtom);
  const [{ trainType, fetchedTrainTypes }, setTrainTypeAtom] =
    useAtom(trainTypeAtom);
  const { selectedLine, selectedDirection } = useAtomValue(lineAtom);
  const [{ loading }, setNavigationAtom] = useAtom(navigationAtom);
  const grpcClient = useGRPC();
  const [error, setError] = useState(null);

  const fetchTrainTypes = useCallback(async () => {
    try {
      if (!selectedLine?.station?.id) {
        return;
      }

      setNavigationAtom((prev) => ({ ...prev, loading: true }));

      const req = new GetTrainTypesByStationIdRequest();
      req.setStationId(selectedLine.station.id);
      const trainTypesRes = (
        await grpcClient?.getTrainTypesByStationId(req, null)
      )?.toObject();

      const trainTypesList = trainTypesRes?.trainTypesList ?? [];

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
          trainType: findLocalType(trainTypesList),
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
              kind: TrainTypeKind.DEFAULT
            },
            ...trainTypesList,
          ],
        }));
      } else {
        setTrainTypeAtom((prev) => ({
          ...prev,
          trainType: findLocalType(trainTypesList),
          fetchedTrainTypes: trainTypesList,
        }));
      }

      // 各停・快速・特急種別がある場合は該当種別を自動選択する
      const trainTypeString = getTrainTypeString(selectedLine, station);
      switch (trainTypeString) {
        case "local":
          setTrainTypeAtom((prev) => ({
            ...prev,
            trainType: !prev.trainType
              ? findLocalType(fetchedTrainTypes)
              : prev.trainType,
          }));
          break;
        case "rapid":
          setTrainTypeAtom((prev) => ({
            ...prev,
            trainType: !prev.trainType
              ? findRapidType(fetchedTrainTypes)
              : prev.trainType,
          }));
          break;
        case "ltdexp":
          setTrainTypeAtom((prev) => ({
            ...prev,
            trainType: !prev.trainType
              ? findLtdExpType(fetchedTrainTypes)
              : prev.trainType,
          }));
          break;
        default:
          break;
      }

      setNavigationAtom((prev) => ({ ...prev, loading: false }));
    } catch (err) {
      setError(err as any);
      setNavigationAtom((prev) => ({ ...prev, loading: false }));
    }
  }, [
    fetchedTrainTypes,
    grpcClient,
    selectedLine,
    setNavigationAtom,
    setTrainTypeAtom,
    station,
  ]);

  const fetchInitialStationList = useCallback(async () => {
    const lineId = selectedLine?.id;
    if (!lineId) {
      return;
    }

    try {
      setNavigationAtom((prev) => ({ ...prev, loading: true }));

      const req = new GetStationByLineIdRequest();
      req.setLineId(lineId);
      const data = (
        await grpcClient?.getStationsByLineId(req, null)
      )?.toObject();

      if (!data) {
        setNavigationAtom((prev) => ({ ...prev, loading: false }));
        return;
      }

      if (selectedLine.station?.hasTrainTypes) {
        await fetchTrainTypes();
      } else {
        setStationAtom((prev) => ({
          ...prev,
          stations: dropEitherJunctionStation(
            data.stationsList,
            selectedDirection
          ),
        }));
      }

      setNavigationAtom((prev) => ({ ...prev, loading: false }));
    } catch (err) {
      setError(err as any);
      setNavigationAtom((prev) => ({ ...prev, loading: false }));
    }
  }, [
    fetchTrainTypes,
    grpcClient,
    selectedDirection,
    selectedLine?.id,
    selectedLine?.station?.hasTrainTypes,
    setNavigationAtom,
    setStationAtom,
  ]);

  const fetchSelectedTrainTypeStations = useCallback(async () => {
    if (!selectedLine) {
      return;
    }
    setNavigationAtom((prev) => ({ ...prev, loading: true }));

    try {
      if (!trainType?.groupId) {
        const req = new GetStationByLineIdRequest();
        req.setLineId(selectedLine.id);
        const data = (
          await grpcClient?.getStationsByLineId(req, null)
        )?.toObject();

        if (!data) {
          setNavigationAtom((prev) => ({ ...prev, loading: false }));
          return;
        }

        setStationAtom((prev) => ({
          ...prev,
          stations: data.stationsList,
        }));
        setNavigationAtom((prev) => ({ ...prev, loading: false }));
        return;
      }

      const req = new GetStationsByLineGroupIdRequest();
      req.setLineGroupId(trainType.groupId);
      const data = (
        await grpcClient?.getStationsByLineGroupId(req, null)
      )?.toObject();

      if (!data) {
        setNavigationAtom((prev) => ({ ...prev, loading: false }));
        return;
      }

      setStationAtom((prev) => ({
        ...prev,
        stations: dropEitherJunctionStation(
          data.stationsList,
          selectedDirection
        ),
      }));

      setNavigationAtom((prev) => ({ ...prev, loading: false }));
    } catch (err) {
      setError(err as any);
      setNavigationAtom((prev) => ({ ...prev, loading: false }));
    }
  }, [
    grpcClient,
    selectedDirection,
    selectedLine,
    setNavigationAtom,
    setStationAtom,
    trainType,
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
