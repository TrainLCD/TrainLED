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
import useStationList from "../hooks/useStationList";
import useWakeLock from "../hooks/useWakeLock";
import { Station, TrainType } from "../models/grpc";

const BoundPage = () => {
  const setTrainTypeAtom = useSetAtom(trainTypeAtom);
  const [{ station }, setStationAtom] = useAtom(stationAtom);
  const setLineAtom = useSetAtom(lineAtom);

  const { fetchSelectedTrainTypeStations } = useStationList();
  const requestWakeLock = useWakeLock();
  const router = useRouter();

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
    (trainType: TrainType) => {
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

  useEffect(() => {
    fetchSelectedTrainTypeStations();
  }, [fetchSelectedTrainTypeStations]);

  if (!station) {
    return null;
  }

  return (
    <Container>
      <CommonHeader />
      <BoundsPanel
        onBack={clearSelectedLine}
        onSelect={handleSelectedBound}
        onTrainTypeSelect={handleTrainTypeSelect}
      />
      <CommonFooter />
    </Container>
  );
};

export default BoundPage;
