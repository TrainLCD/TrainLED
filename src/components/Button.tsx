'use client';
import styled from 'styled-components';

export default styled.button<{ bgColor?: string }>`
  appearance: none;
  border: 1px solid ${({ bgColor }) => bgColor || '#fff'};
  color: white;
  padding: 12px;
  font-size: 1rem;
  font-family: var(--font-jfdot);
  background-color: ${({ bgColor }) => bgColor || 'transparent'};
  width: 240px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
  }
`;
