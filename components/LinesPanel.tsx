import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { lineAtom } from "../atoms/line";
import { stationAtom } from "../atoms/station";
import { PARENTHESIS_REGEXP } from "../constants";
import { Line } from "../generated/proto/stationapi_pb";
import Button from "./Button";
import { Container, Title } from "./LinesPanel.styled";
import { List, ListItem } from "./List";

const LinesPanel = () => {
  const { station } = useAtomValue(stationAtom);
  const setLineAtom = useSetAtom(lineAtom);

  const router = useRouter();

  const handleSelectLine = useCallback(
    (line: Line) => {
      setLineAtom((prev) => ({ ...prev, selectedLine: line }));
      router.push("/bound", { scroll: false });
    },
    [router, setLineAtom]
  );

  const lines = station?.lines ?? [];

  return (
    <Container>
      <Title>路線を選択してください</Title>
      {lines.length > 0 ? (
        <List>
          {lines.map((l) => (
            <ListItem key={l.id}>
              <Button
                onClick={() => handleSelectLine(l)}
                bgColor={l.color ?? "#fff"}
              >
                {l.lineSymbols.length > 0 &&
                  `[${l.lineSymbols.map((sym) => sym?.symbol).join("/")}]`}
                {l.nameShort.replace(PARENTHESIS_REGEXP, "")}
              </Button>
            </ListItem>
          ))}
        </List>
      ) : null}
    </Container>
  );
};

export default LinesPanel;
