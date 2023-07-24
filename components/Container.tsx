import styled from "styled-components";

const Container = styled.main<{ fullHeight?: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "auto")};
  padding-top: ${({ fullHeight }) => (fullHeight ? "0" : "64px")};
  padding-bottom: ${({ fullHeight }) => (fullHeight ? "0" : "64px")};
  user-select: none;
`;

export default Container;
