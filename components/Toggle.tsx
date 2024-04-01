import { Container, Text } from "./Toggle.styled";

type Props = {
  enabled: boolean;
  text: string;
  onClick: () => void;
};

export const Toggle = ({ enabled, text, onClick }: Props) => {
  return (
    <Container onClick={onClick} enabled={enabled}>
      <Text>
        {text}: {enabled ? "オン" : "オフ"}
      </Text>
    </Container>
  );
};
