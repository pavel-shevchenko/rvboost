import React from 'react';
import styled from 'styled-components';
import { colors } from '@/app/_components/root-layout/styles';

const Svg = styled.svg`
  color: ${colors.green500};
  height: 1.5rem;
  width: 1.5rem;
`;

export const Tick = () => (
  <Svg stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </Svg>
);
