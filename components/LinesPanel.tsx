import styled from "styled-components";
import { parenthesisRegexp } from "../constants/regexp";
import { Line } from "../generated/proto/stationapi_pb";
import Button from "./Button";
import { List, ListItem } from "./List";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
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
            {l.lineSymbols.length > 0 &&
              `[${l.lineSymbols.map((sym) => sym?.symbol).join("/")}]`}
            {l.nameShort.replace(parenthesisRegexp, "")}
          </Button>
        </ListItem>
      ))}
    </List>
  </Container>
);

export default LinesPanel;
