"use client";
import Link from "next/link";
import styled from "styled-components";
import Button from "../components/Button";
import Heading from "../components/Heading";

export const SearchStationAnchor = styled(Link)`
  appearance: none;
  border: 1px solid #fff;
  color: white;
  padding: 12px;
  font-size: 1rem;
  font-family: var(--font-jfdot);
  width: 240px;
  cursor: pointer;
  align-self: center;
  text-align: center;
  margin-top: 32px;

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
  }
`;

export const UpdateButton = styled(Button)`
  margin-top: 32px;
  align-self: center;
`;

export const StyledHeading = styled(Heading)`
  margin: 32px 0 0 0;
`;
