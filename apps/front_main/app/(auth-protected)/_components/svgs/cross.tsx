import React from 'react';
import styled from 'styled-components';
import { colors } from '@/app/_components/root-layout/styles';

const Svg = styled.svg`
  height: 1.5rem;
  width: 1.5rem;
  color: ${colors.white};
`;

export const Cross = () => (
  <Svg stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </Svg>
);
