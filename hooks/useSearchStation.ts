import { useQuery } from "@connectrpc/connect-query";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import { getStationsByName } from "../generated/proto/stationapi-StationAPI_connectquery";
import { Station } from "../generated/proto/stationapi_pb";
import { groupStations } from "../utils/groupStations";

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
  stations: Station[];
  isLoading: boolean;
  search: (query: string) => Promise<Station[] | undefined>;
  submitStation: (station: Station) => void;
};

const useSearchStation = (): ReturnValue => {
  const [searchQuery, setSearchQuery] = useState("");

  const prevQueryRef = useRef<string>();

  const setLocation = useSetAtom(navigationAtom);
  const setStationAtom = useSetAtom(stationAtom);

  const router = useRouter();

  const { data: byNameData, isLoading: isLoadingByName } = useQuery(
    getStationsByName,
    {
      stationName: searchQuery,
      limit: 100,
    },
    { enabled: searchQuery.length > 0 }
  );

  const search = useCallback(
    async (query: string): Promise<Station[] | undefined> => {
      const trimmedQuery = query.trim();
      const trimmedPrevQuery = prevQueryRef.current?.trim();
      if (!trimmedQuery.length || trimmedQuery === trimmedPrevQuery) {
        return;
      }

      if (trimmedQuery.length) {
        prevQueryRef.current = trimmedQuery;
        setSearchQuery(trimmedQuery);
      }
    },
    []
  );

  const submitStation = useCallback(
    (station: Station) => {
      setStationAtom((prev) => ({
        ...prev,
        station,
      }));
      setLocation((prev) => ({
        ...prev,
        location: {
          timestamp: new Date().getTime(),
          coords: {
            latitude: station.latitude,
            longitude: station.longitude,
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            speed: 0,
            heading: 0,
          },
        },
      }));
      router.push("/");
    },
    [router, setLocation, setStationAtom]
  );

  return {
    stations: groupStations(byNameData?.stations ?? []),
    isLoading: isLoadingByName,
    search,
    submitStation,
  };
};

export default useSearchStation;
