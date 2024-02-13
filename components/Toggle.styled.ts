"use client";
import styled from "styled-components";

export const Container = styled.button<{ enabled: boolean }>`
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
  font-family: var(--font-jfdot);

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
  }
`;

export const Text = styled.p`
  font-size: 1rem;
  margin: 0;
  font-weight: bold;
`;
