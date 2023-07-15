import styled from "styled-components";
import type { Station } from "../models/grpc";
import Button from "./Button";
import { List, ListItem } from "./List";

const Container = styled.div`
  text-align: center;
`;
const Title = styled.h3``;

type Props = {
  stationGroupList: [Station[], Station[]];
  onSelect: (boundStation: Station, index: number) => void;
};

const BoundsPanel = ({ stationGroupList, onSelect }: Props) => (
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
  </Container>
);

export default BoundsPanel;
