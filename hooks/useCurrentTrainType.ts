import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { trainTypeAtom } from "../atoms/trainType";
import { TrainType, TrainTypeKind } from "../generated/proto/stationapi_pb";
import useCurrentLine from "./useCurrentLine";

const useCurrentTrainType = (): TrainType | null => {
  const { trainType } = useAtomValue(trainTypeAtom);
  const currentLine = useCurrentLine();

  const currentTrainType = useMemo(
    () =>
      trainType?.lines?.length || trainType?.kind === TrainTypeKind.Branch
        ? trainType?.lines?.find((l) => l.id === currentLine?.id)?.trainType
        : trainType ?? null,
    [currentLine?.id, trainType]
  );

  return currentTrainType ?? null;
};

export default useCurrentTrainType;
