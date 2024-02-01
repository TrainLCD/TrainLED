import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { trainTypeAtom } from "../atoms/trainType";
import { TrainType, TrainTypeKind } from "../generated/proto/stationapi_pb";
import useCurrentLine from "./useCurrentLine";

const useCurrentTrainType = (): TrainType | null => {
  const { selectedTrainType } = useAtomValue(trainTypeAtom);
  const currentLine = useCurrentLine();

  const currentTrainType = useMemo(
    () =>
      selectedTrainType?.lines?.length ||
      selectedTrainType?.kind === TrainTypeKind.Branch
        ? selectedTrainType?.lines?.find((l) => l.id === currentLine?.id)
            ?.trainType
        : selectedTrainType ?? null,
    [currentLine?.id, selectedTrainType]
  );

  return currentTrainType ?? null;
};

export default useCurrentTrainType;
