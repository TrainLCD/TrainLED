import styled from "styled-components";
import type { Station } from "../models/StationAPI";
import Button from "./Button";
import { List, ListItem } from "./List";

const Container = styled.div`
  text-align: center;
`;
const Title = styled.h3``;

type Props = {
  bounds: [Station | null, Station | null] | undefined;
  onSelect: (line: Station) => void;
};

const BoundsPanel = ({ bounds, onSelect }: Props) => {
  const eligibleBounds = bounds?.filter((b) => b);
  if (eligibleBounds?.length === 0) {
    return null;
  }

  return (
    <Container>
      <Title>行き先極度選択（しなさい）</Title>
      <List>
        {eligibleBounds?.map(
          (b) =>
            b && (
              <ListItem key={b?.id}>
                <Button onClick={onSelect.bind(null, b)}>{b?.name}</Button>
              </ListItem>
            )
        )}
      </List>
    </Container>
  );
};

export default BoundsPanel;
