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
  margin: 16px 0 0 0;
`;
type Props = {
  lines: Line[];
  onSelect: (line: Line) => void;
};

const LinesPanel = ({ lines, onSelect }: Props) => (
  <Container>
    <Title>路線極度選択（しなさい）</Title>
    {lines.length > 0 ? (
      <List>
        {lines.map((l) => (
          <ListItem key={l.id}>
            <Button
              onClick={onSelect.bind(null, l)}
              bgColor={l.color ?? "#fff"}
            >
              {l.lineSymbols.length > 0 &&
                `[${l.lineSymbols.map((sym) => sym?.symbol).join("/")}]`}
              {l.nameShort.replace(parenthesisRegexp, "")}
            </Button>
          </ListItem>
        ))}
      </List>
    ) : null}
  </Container>
);

export default LinesPanel;
