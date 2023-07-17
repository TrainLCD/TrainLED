import styled from "styled-components";

const Container = styled.main<{ fullHeight?: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "auto")};
  user-select: none;
`;

export default Container;
