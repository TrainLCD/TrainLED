import styled from "styled-components";

const HorizontalSpacer = styled.div<{ wide?: boolean }>`
  width: ${({ wide }) => (wide ? 10 : 3)}vw;
`;

export default HorizontalSpacer;
