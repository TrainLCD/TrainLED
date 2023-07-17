import { useAtomValue } from "jotai";
import { ChangeEvent, memo, useCallback } from "react";
import styled from "styled-components";
import { lineAtom } from "../atoms/line";
import { trainTypeAtom } from "../atoms/trainType";
import useBounds from "../hooks/useBounds";
import useCurrentLine from "../hooks/useCurrentLine";
import { LineDirection } from "../models/bound";
import type { Station, TrainType } from "../models/grpc";
import {
  getIsMeijoLine,
  getIsOsakaLoopLine,
  getIsYamanoteLine,
} from "../utils/loopLine";
import Button from "./Button";
import { List, ListItem } from "./List";

const Container = styled.div`
  text-align: center;
`;
const Title = styled.h3``;

const BackButtonContainer = styled.div`
  margin-bottom: 20px;
`;

const TrainTypeInputContainer = styled.div`
  margin-bottom: 20px;
`;

const TrainTypeSelect = styled.select`
  appearance: none;
  background-color: transparent;
  border: 1px solid #fff;
  color: white;
  font-size: 1rem;
  padding: 12px;
  text-align: center;
  outline: none;
  min-width: 200px;
  font-family: "JF-Dot-jiskan24";
`;

type Props = {
  onSelect: (boundStation: Station, index: number) => void;
  onBack: () => void;
  onTrainTypeSelect: (trainType: TrainType) => void;
};

const BoundsPanel = ({ onSelect, onBack, onTrainTypeSelect }: Props) => {
  const { selectedDirection } = useAtomValue(lineAtom);
  const { trainType, fetchedTrainTypes } = useAtomValue(trainTypeAtom);

  const currentLine = useCurrentLine();
  const { withTrainTypes, bounds } = useBounds();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newTrainType = fetchedTrainTypes.find(
        (tt) => Number(e.currentTarget.value) === tt.id
      );
      if (newTrainType) {
        onTrainTypeSelect(newTrainType);
      }
    },
    [fetchedTrainTypes, onTrainTypeSelect]
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
        (getIsYamanoteLine(currentLine.id) ||
          getIsOsakaLoopLine(currentLine.id)) &&
        selectedDirection
      ) {
        const directionName =
          selectedDirection === "INBOUND" ? "内回り" : "外回り";
        return `${directionName}(${stations
          .map((station) => station.name)
          .join("・")})`;
      }

      return `${stations.map((station) => station.name).join("・")}方面`;
    },
    [currentLine, selectedDirection]
  );

  const renderLines = useCallback(() => {
    return bounds?.map((group, index) => {
      return (
        group[0] && (
          <ListItem key={group[0]?.id}>
            <Button onClick={() => onSelect(group[0], index)}>
              {getBoundTypeText(group, !index ? "INBOUND" : "OUTBOUND")}
            </Button>
          </ListItem>
        )
      );
    });
  }, [bounds, getBoundTypeText, onSelect]);

  return (
    <Container>
      <Title>行き先極度選択（しなさい）</Title>
      <List>{renderLines()}</List>
      {withTrainTypes && (
        <TrainTypeInputContainer>
          <TrainTypeSelect value={trainType?.id ?? 0} onChange={handleChange}>
            {fetchedTrainTypes.map((tt) => (
              <option key={tt.id} value={tt.id}>
                {tt.name}
              </option>
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
