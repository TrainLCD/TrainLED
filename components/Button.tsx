import styled from "styled-components";

export default styled.button<{ bgColor?: string }>`
  appearance: none;
  border: 1px solid ${({ bgColor }) => bgColor || "#fff"};
  background: none;
  color: white;
  padding: 12px;
  font-size: 1rem;
  font-family: "JF-Dot-jiskan24";
  background-color: ${({ bgColor }) => bgColor || "#212121"};
  min-width: 240px;

  &:focus {
    outline: none;
  }
`;
