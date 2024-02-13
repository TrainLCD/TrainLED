"use client";
import styled from "styled-components";
import Heading from "../components/Heading";

export const SearchStationButtonContainer = styled.div<{ padTop?: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

export const StyledHeading = styled(Heading)`
  margin: 32px 0 0 0;
`;
