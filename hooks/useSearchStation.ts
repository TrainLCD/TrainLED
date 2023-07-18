import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import {
  GetStationByCoordinatesRequest,
  GetStationsByNameRequest,
} from "../generated/stationapi_pb";
import StationForSearch from "../models/StationForSearch";
import { Station } from "../models/grpc";
import useGRPC from "./useGRPC";

export const PREFS_JA = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

type ReturnValue = {
  loading: boolean;
  search: (query: string) => Promise<StationForSearch[]>;
  submitStation: (station: StationForSearch) => void;
};

const useSearchStation = (): ReturnValue => {
  const [dirty, setDirty] = useState(false);
  const [byNameError, setByNameError] = useState<Error | null>(null);
  const [byCoordinatesError, setByCoordinatesError] = useState<Error | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const prevQueryRef = useRef<string>();

  const { location } = useAtomValue(navigationAtom);
  const setStationAtom = useSetAtom(stationAtom);

  const grpcClient = useGRPC();

  const processStations = useCallback(
    (stations: Station[], sortRequired?: boolean): Station[] => {
      const foundStations = stations
        .map((g, i, arr) => {
          const sameNameAndDifferentPrefStations = arr.filter(
            (s) => s.name === g.name && s.prefectureId !== g.prefectureId
          );
          if (sameNameAndDifferentPrefStations.length) {
            return {
              ...g,
              nameForSearch: `${g.name}(${PREFS_JA[g.prefectureId - 1]})`,
            };
          }
          return {
            ...g,
            nameForSearch: g.name,
          };
        })
        .map((g, i, arr) => {
          const sameNameStations = arr.filter(
            (s) => s.nameForSearch === g.nameForSearch
          );
          if (sameNameStations.length) {
            return sameNameStations.reduce((acc, cur) => ({
              ...acc,
              lines: Array.from(new Set([...acc.linesList, ...cur.linesList])),
            }));
          }
          return g;
        })
        .filter(
          (g, i, arr) =>
            arr.findIndex((s) => s.nameForSearch === g.nameForSearch) === i
        )
        .sort((a, b) =>
          sortRequired ? b.linesList.length - a.linesList.length : 0
        );

      return foundStations as Station[];
    },
    []
  );

  useEffect(() => {
    const fetchAsync = async () => {
      if (!location?.coords || dirty) {
        return;
      }
      try {
        setLoading(true);

        const byCoordinatesReq = new GetStationByCoordinatesRequest();
        byCoordinatesReq.setLatitude(location.coords.latitude);
        byCoordinatesReq.setLongitude(location.coords.longitude);
        byCoordinatesReq.setLimit(10);
        const byCoordinatesData = (
          await grpcClient?.getStationsByCoordinates(byCoordinatesReq, null)
        )?.toObject();

        if (byCoordinatesData?.stationsList) {
          processStations(
            byCoordinatesData?.stationsList
              .filter((s) => !!s)
              .map((s) => s as Station) || []
          );
        }
        setLoading(false);
      } catch (err) {
        setByCoordinatesError(err as Error);
        setLoading(false);
      }
    };

    fetchAsync();
  }, [dirty, grpcClient, location?.coords, processStations]);

  const search = useCallback(
    async (query: string): Promise<StationForSearch[]> => {
      const trimmedQuery = query.trim();
      const trimmedPrevQuery = prevQueryRef.current?.trim();
      if (!trimmedQuery.length || trimmedQuery === trimmedPrevQuery) {
        return [];
      }

      setDirty(true);
      // try {
      //   const eligibility = await checkEligibility(trimmedQuery)

      //   switch (eligibility) {
      //     case 'eligible':
      //       setDevState((prev) => ({ ...prev, token: trimmedQuery }))
      //       await AsyncStorage.setItem(
      //         ASYNC_STORAGE_KEYS.DEV_MODE_ENABLED,
      //         'true'
      //       )
      //       await AsyncStorage.setItem(
      //         ASYNC_STORAGE_KEYS.DEV_MODE_TOKEN,
      //         trimmedQuery
      //       )
      //       Alert.alert(
      //         translate('warning'),
      //         translate('enabledDevModeDescription'),
      //         [{ text: 'OK', onPress: onPressBack }]
      //       )
      //       break
      //     // トークンが無効のときも何もしない
      //     default:
      //       break
      //   }
      // } catch (err) {
      //   Alert.alert(translate('errorTitle'), translate('apiErrorText'))
      // } finally {
      //   setLoadingEligibility(false)
      // }

      prevQueryRef.current = trimmedQuery;

      try {
        setLoading(true);

        const byNameReq = new GetStationsByNameRequest();
        byNameReq.setStationName(trimmedQuery);
        byNameReq.setLimit(10);
        const byNameData = (
          await grpcClient?.getStationsByName(byNameReq, null)
        )?.toObject();

        if (byNameData?.stationsList) {
          return processStations(
            byNameData?.stationsList
              ?.filter((s) => !!s)
              .map((s) => s as Station),
            true
          );
        }
        setLoading(false);
      } catch (err) {
        setByNameError(err as Error);
        setLoading(false);
      }
      return [];
    },
    [grpcClient, processStations]
  );

  // useEffect(() => {
  //   if (byNameError || byCoordinatesError) {
  //     Alert.alert(translate("errorTitle"), translate("apiErrorText"));
  //   }
  // }, [byCoordinatesError, byNameError]);

  const submitStation = useCallback(
    (station: StationForSearch) => {
      setStationAtom((prev) => ({
        ...prev,
        station,
      }));
    },
    [setStationAtom]
  );

  return { loading, search, submitStation };
};

export default useSearchStation;
