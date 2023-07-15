import { useAtomValue } from "jotai";
import { ChangeEvent, memo, useCallback } from "react";
import styled from "styled-components";
import { trainTypeAtom } from "../atoms/trainType";
import useBounds from "../hooks/useBounds";
import type { Station, TrainType } from "../models/grpc";
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
  stationGroupList: [Station[], Station[]];
  onSelect: (boundStation: Station, index: number) => void;
  onBack: () => void;
  onTrainTypeSelect: (trainType: TrainType) => void;
};

const BoundsPanel = ({
  stationGroupList,
  onSelect,
  onBack,
  onTrainTypeSelect,
}: Props) => {
  const { trainType, fetchedTrainTypes } = useAtomValue(trainTypeAtom);

  const { withTrainTypes } = useBounds();

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

  return (
    <Container>
      <Title>行き先極度選択（しなさい）</Title>
      <List>
        {stationGroupList?.map(
          (group, index) =>
            group[0] && (
              <ListItem key={group[0]?.id}>
                <Button onClick={() => onSelect(group[0], index)}>
                  {group.map((station) => station.name).join("・")}方面
                </Button>
              </ListItem>
            )
        )}
      </List>
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
