import { useAtomValue } from "jotai";
import { ChangeEvent, memo, useCallback } from "react";
import styled from "styled-components";
import { trainTypeAtom } from "../atoms/trainType";
import { Station, TrainType } from "../generated/proto/stationapi_pb";
import useCurrentLine from "../hooks/useCurrentLine";
import useTrainTypeLabels from "../hooks/useTrainTypeLabels";
import { LineDirection } from "../models/bound";
import {
  getIsMeijoLine,
  getIsOsakaLoopLine,
  getIsYamanoteLine,
} from "../utils/loopLine";
import Button from "./Button";
import { List, ListItem } from "./List";

const Container = styled.div``;
const Title = styled.h3`
  text-align: center;
`;

const BackButtonContainer = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
`;

const TrainTypeInputContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const TrainTypeSelect = styled.select`
  display: block;
  appearance: none;
  background-color: transparent;
  border: 1px solid #fff;
  color: white;
  font-size: 1rem;
  padding: 12px;
  outline: none;
  min-width: 240px;
  font-family: "JF-Dot-jiskan24";
  margin-top: 8px;
  text-align: center;
  max-width: 100%;

  :disabled {
    opacity: 0.5;
  }
`;

const TrainTypeOption = styled.option`
  background-color: ${({ theme }) => theme.bgColor || "#212121"};
  color: white;
`;

const ButtonInnerText = styled.span`
  font-weight: bold;
`;

type Props = {
  isLoading: boolean;
  bounds: [Station[], Station[]];
  onSelect: (boundStation: Station, index: number) => void;
  onBack: () => void;
  onTrainTypeSelect: (trainType: TrainType) => void;
};

const BoundsPanel = ({
  isLoading,
  bounds,
  onSelect,
  onBack,
  onTrainTypeSelect,
}: Props) => {
  const { selectedTrainType, trainTypes } = useAtomValue(trainTypeAtom);

  const currentLine = useCurrentLine();
  const trainTypeLabels = useTrainTypeLabels(trainTypes);

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
    (stations: Station[], direction: LineDirection) => {
      if (!currentLine) {
        return "";
      }
      const directionName = direction === "INBOUND" ? "右回り" : "左回り";
      if (getIsMeijoLine(currentLine.id)) {
        return `${directionName}(${stations
          .map((station) => station.name)
          .join("・")})`;
      }

      if (
        getIsYamanoteLine(currentLine.id) ||
        (getIsOsakaLoopLine(currentLine.id) && !selectedTrainType)
      ) {
        const directionName = direction === "INBOUND" ? "内回り" : "外回り";
        return `${directionName}(${stations
          .map((station) => station.name)
          .join("・")})`;
      }

      return `${stations.map((station) => station.name).join("・")}方面`;
    },
    [currentLine, selectedTrainType]
  );

  const renderBounds = useCallback(
    () =>
      bounds?.map(
        (group, index) =>
          group[0] && (
            <ListItem key={group[0]?.id}>
              <Button
                disabled={isLoading}
                onClick={() => onSelect(group[0], index)}
              >
                <ButtonInnerText>
                  {getBoundTypeText(group, !index ? "INBOUND" : "OUTBOUND")}
                </ButtonInnerText>
              </Button>
            </ListItem>
          )
      ),
    [bounds, getBoundTypeText, isLoading, onSelect]
  );

  return (
    <Container>
      <Title>行き先極度選択（しなさい）</Title>
      <List>{isLoading ? <p>Loading...</p> : renderBounds()}</List>
      {trainTypes.length > 0 && (
        <TrainTypeInputContainer>
          <TrainTypeSelect
            value={selectedTrainType?.id ?? 0}
            onChange={handleChange}
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
        </TrainTypeInputContainer>
      )}
      <BackButtonContainer>
        <Button onClick={onBack}>戻る</Button>
      </BackButtonContainer>
    </Container>
  );
};

export default memo(BoundsPanel);
