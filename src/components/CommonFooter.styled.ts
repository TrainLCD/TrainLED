'use client';
import Link from 'next/link';
import styled from 'styled-components';

export const CreditContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 32px;
`;

export const CautionText = styled.p`
  line-height: 1.5;
  text-align: center;
  margin: 8px 0;
`;

export const FeedbackLink = styled(Link)`
  line-height: 1.5;
  text-align: center;
  margin: 8px 0;
  text-decoration: underline;
`;
