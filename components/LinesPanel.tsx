import styled from "styled-components";
import { Line } from "../models/StationAPI";
import Button from "./Button";
import { List, ListItem } from "./List";

const Container = styled.div``;
const Title = styled.h3`
  text-align: center;
`;
type Props = {
  lines: Line[];
  onSelect: (line: Line) => void;
};

const LinesPanel = ({ lines, onSelect }: Props) => {
  if (!lines.length) {
    return null;
  }

  return (
    <Container>
      <Title>路線極度選択（しなさい）</Title>
      <List>
        {lines.map((l) => (
          <ListItem key={l.id}>
            <Button onClick={onSelect.bind(null, l)}>{l.name}</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default LinesPanel;
