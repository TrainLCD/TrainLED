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
import useUpdateStationList from "../hooks/useUpdateStationList";
import useWakeLock from "../hooks/useWakeLock";

const BoundPage = () => {
  const setTrainTypeAtom = useSetAtom(trainTypeAtom);
  const [{ station }, setStationAtom] = useAtom(stationAtom);
  const setLineAtom = useSetAtom(lineAtom);

  const { isLoading } = useUpdateStationList();
  const requestWakeLock = useWakeLock();
  const router = useRouter();

  useEffect(() => {
    if (!station) {
      router.replace("/");
    }
  }, [router, station]);

  const handleTrainTypeSelect = useCallback(
    (selectedTrainType: TrainType) =>
      setTrainTypeAtom((prev) => ({
        ...prev,
        selectedTrainType,
      })),
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
        onBack={() => router.replace("/")}
        onSelect={handleSelectedBound}
        onTrainTypeSelect={handleTrainTypeSelect}
        isLoading={isLoading}
      />
      <CommonFooter />
    </Container>
  );
};

export default BoundPage;
