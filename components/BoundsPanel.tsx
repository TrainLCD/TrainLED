import { useAtom, useAtomValue } from "jotai";
import { ChangeEvent, memo, useCallback } from "react";
import { lineAtom } from "../atoms/line";
import { navigationAtom } from "../atoms/navigation";
import { trainTypeAtom } from "../atoms/trainType";
import { Station, TrainType } from "../generated/proto/stationapi_pb";
import useBounds from "../hooks/useBounds";
import useCurrentLine from "../hooks/useCurrentLine";
import useCurrentStation from "../hooks/useCurrentStation";
import useTrainTypeLabels from "../hooks/useTrainTypeLabels";
import { LineDirection } from "../models/bound";
import {
  getIsMeijoLine,
  getIsOsakaLoopLine,
  getIsYamanoteLine,
} from "../utils/loopLine";
import {
  BackButtonContainer,
  ButtonInnerText,
  Container,
  InputsContainer,
  Title,
  TrainTypeOption,
  TrainTypeSelect,
} from "./BoundsPanel.styled";
import Button from "./Button";
import { List, ListItem } from "./List";
import { Toggle } from "./Toggle";

type Props = {
  isLoading: boolean;
  onSelect: (boundStation: Station, index: number) => void;
  onBack: () => void;
  onTrainTypeSelect: (trainType: TrainType) => void;
};

const BoundsPanel = ({
  isLoading,
  onSelect,
  onBack,
  onTrainTypeSelect,
}: Props) => {
  const { selectedTrainType, trainTypes } = useAtomValue(trainTypeAtom);
  const { selectedDirection } = useAtomValue(lineAtom);
  const [{ autoModeEnabled }, setNavigation] = useAtom(navigationAtom);

  const station = useCurrentStation();
  const currentLine = useCurrentLine();
  const trainTypeLabels = useTrainTypeLabels(trainTypes);
  const { bounds } = useBounds();

  const switchedBounds =
    selectedDirection === "INBOUND" ? bounds.inbound : bounds.outbound;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newTrainType = trainTypes.find(
        (tt) => Number(e.currentTarget.value) === tt.id
      );
      if (newTrainType) {
        onTrainTypeSelect(newTrainType);
      }
    },
    [trainTypes, onTrainTypeSelect]
  );

  const getBoundTypeText = useCallback(
    (direction: LineDirection) => {
      if (!currentLine) {
        return "";
      }

      const directionName = direction === "INBOUND" ? "右回り" : "左回り";
      const boundsByDirection =
        direction === "INBOUND" ? bounds.inbound ?? [] : bounds.outbound ?? [];
      if (getIsMeijoLine(currentLine.id)) {
        return `${directionName}(${boundsByDirection
          .map((s) => s.name)
          .join("・")}方面)`;
      }

      if (
        getIsYamanoteLine(currentLine.id) ||
        (getIsOsakaLoopLine(currentLine.id) && !selectedTrainType)
      ) {
        const directionName = direction === "INBOUND" ? "内回り" : "外回り";
        return `${directionName}(${boundsByDirection
          .map((s) => s.name)
          .join("・")}方面)`;
      }

      return `${boundsByDirection.map((s) => s.name).join("・")}方面`;
    },
    [bounds.inbound, bounds.outbound, currentLine, selectedTrainType]
  );

  const renderBounds = useCallback(
    () =>
      Object.values(bounds)?.map(([bound], index) => {
        return (
          <ListItem key={bound?.id}>
            <Button disabled={isLoading} onClick={() => onSelect(bound, index)}>
              <ButtonInnerText>
                {getBoundTypeText(!index ? "INBOUND" : "OUTBOUND")}
              </ButtonInnerText>
            </Button>
          </ListItem>
        );
      }),
    [bounds, getBoundTypeText, isLoading, onSelect]
  );

  const handleAutoModeToggle = () =>
    setNavigation((prev) => ({
      ...prev,
      autoModeEnabled: !prev.autoModeEnabled,
    }));

  return (
    <Container>
      <Title>行き先を選択してください</Title>
      <List>{isLoading ? <p>Loading...</p> : renderBounds()}</List>
      <InputsContainer>
        {station?.hasTrainTypes && trainTypes.length > 0 && (
          <TrainTypeSelect
            value={selectedTrainType?.id ?? 0}
            onChange={handleChange}
            disabled={isLoading}
          >
            {trainTypeLabels.map((label, idx) => (
              <TrainTypeOption
                key={trainTypes[idx]?.id}
                value={trainTypes[idx]?.id}
              >
                {label}
              </TrainTypeOption>
            ))}
          </TrainTypeSelect>
        )}
        <Toggle
          enabled={autoModeEnabled}
          onClick={handleAutoModeToggle}
          text="オートモード"
        />
      </InputsContainer>

      <BackButtonContainer>
        <Button onClick={onBack}>戻る</Button>
      </BackButtonContainer>
    </Container>
  );
};

export default memo(BoundsPanel);
