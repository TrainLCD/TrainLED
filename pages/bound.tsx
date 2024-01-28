import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { trainTypeAtom } from "../atoms/trainType";
import BoundsPanel from "../components/BoundsPanel";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";
import Container from "../components/Container";
import { Station, TrainType } from "../generated/proto/stationapi_pb";
import useBounds from "../hooks/useBounds";
import useUpdateStationList from "../hooks/useUpdateStationList";
import useWakeLock from "../hooks/useWakeLock";

const BoundPage = () => {
  const setTrainTypeAtom = useSetAtom(trainTypeAtom);
  const [{ station }, setStationAtom] = useAtom(stationAtom);
  const setLineAtom = useSetAtom(lineAtom);

  const { isLoading } = useUpdateStationList();
  const requestWakeLock = useWakeLock();
  const router = useRouter();
  const { bounds } = useBounds();

  useEffect(() => {
    if (!station) {
      router.replace("/");
    }
  }, [router, station]);

  const clearSelectedLine = useCallback(() => {
    setTrainTypeAtom((prev) => ({
      ...prev,
      trainType: null,
      fetchedTrainTypes: [],
    }));
    setStationAtom((prev) => ({ ...prev, stations: [] }));
    setLineAtom((prev) => ({ ...prev, selectedLine: null }));
    router.replace("/");
  }, [router, setLineAtom, setStationAtom, setTrainTypeAtom]);

  const handleTrainTypeSelect = useCallback(
    async (trainType: TrainType) => {
      if (trainType.id === 0) {
        setTrainTypeAtom((prev) => ({
          ...prev,
          trainType: null,
        }));
        return;
      }

      setTrainTypeAtom((prev) => ({
        ...prev,
        trainType,
      }));
    },
    [setTrainTypeAtom]
  );

  const handleSelectedBound = useCallback(
    async (selectedBound: Station, index: number) => {
      requestWakeLock();

      setStationAtom((prev) => ({ ...prev, selectedBound }));
      setLineAtom((prev) => ({
        ...prev,
        selectedDirection: !index ? "INBOUND" : "OUTBOUND",
      }));

      router.push("/led");
    },
    [requestWakeLock, router, setLineAtom, setStationAtom]
  );

  if (!station) {
    return null;
  }

  return (
    <Container>
      <CommonHeader />
      <BoundsPanel
        bounds={bounds}
        onBack={clearSelectedLine}
        onSelect={handleSelectedBound}
        onTrainTypeSelect={handleTrainTypeSelect}
        isLoading={isLoading}
      />
      <CommonFooter />
    </Container>
  );
};

export default BoundPage;
