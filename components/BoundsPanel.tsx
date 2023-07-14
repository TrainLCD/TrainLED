import styled from "styled-components";
import type { Station } from "../models/grpc";
import Button from "./Button";
import { List, ListItem } from "./List";

const Container = styled.div`
  text-align: center;
`;
const Title = styled.h3``;

type Props = {
  bounds: [Station[], Station[]];
  onSelect: (line: Station) => void;
};

const BoundsPanel = ({ bounds, onSelect }: Props) => {
  if (!bounds[0][0] || !bounds[1][0]) return null;

  return (
    <Container>
      <Title>行き先極度選択（しなさい）</Title>
      <List>
        {bounds?.map(
          (bound, index) =>
            bound && (
              <ListItem key={bound[index]?.id}>
                <Button onClick={onSelect.bind(null, bound[index])}>
                  {bound.map((station) => station.name)}
                </Button>
              </ListItem>
            )
        )}
      </List>
    </Container>
  );
};

export default BoundsPanel;
