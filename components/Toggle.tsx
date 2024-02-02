import styled from "styled-components";

type Props = {
  enabled: boolean;
  text: string;
  onClick: () => void;
};

const Container = styled.button<{ enabled: boolean }>`
  display: block;
  appearance: none;
  background-color: ${({ enabled }) => (enabled ? "#fff" : "#212121")};
  border: 1px solid #fff;
  color: ${({ enabled }) => (enabled ? "#212121" : "#fff")};
  font-size: 1rem;
  padding: 12px;
  outline: none;
  width: 240px;
  text-align: center;
  max-width: 100%;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
  }
`;

const Text = styled.p`
  font-family: "JF-Dot-jiskan24";
  font-size: 1rem;
  margin: 0;
  font-weight: bold;
`;

export const Toggle = ({ enabled, text, onClick }: Props) => {
  return (
    <Container onClick={onClick} enabled={enabled}>
      <Text>
        {text}: {enabled ? "オン" : "オフ"}
      </Text>
    </Container>
  );
};
