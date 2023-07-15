import styled from "styled-components";
import { parenthesisRegexp } from "../constants/regexp";
import type { Line } from "../models/grpc";
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

const LinesPanel = ({ lines, onSelect }: Props) => (
  <Container>
    <Title>路線極度選択（しなさい）</Title>
    <List>
      {lines.map((l) => (
        <ListItem key={l.id}>
          <Button onClick={onSelect.bind(null, l)} bgColor={l.color ?? "#ffｆ"}>
            {l.lineSymbolsList.length > 0 &&
              `[{${l.lineSymbolsList.map((sym) => sym?.symbol).join("/")}}]`}
            {l.nameShort.replace(parenthesisRegexp, "")}
          </Button>
        </ListItem>
      ))}
    </List>
  </Container>
);

export default LinesPanel;
