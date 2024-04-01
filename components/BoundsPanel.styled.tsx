"use client";
import styled from "styled-components";

export const Container = styled.div``;

export const Title = styled.h3`
  text-align: center;
`;

export const BackButtonContainer = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: center;
`;

export const InputsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 32px;
`;

export const TrainTypeSelect = styled.select`
  display: block;
  appearance: none;
  background-color: transparent;
  border: 1px solid #fff;
  color: white;
  font-size: 1rem;
  padding: 12px;
  outline: none;
  min-width: 240px;
  text-align: center;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  :disabled {
    opacity: 0.5;
  }
`;

export const TrainTypeOption = styled.option`
  background-color: ${({ theme }) => theme.bgColor || "#212121"};
  color: white;
`;

export const ButtonInnerText = styled.span`
  font-weight: bold;
`;
