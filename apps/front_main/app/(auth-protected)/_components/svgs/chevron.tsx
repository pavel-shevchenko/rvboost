import React from 'react';
import styled from 'styled-components';
import { colors } from '@/app/_components/root-layout/styles';

const Svg = styled.svg`
  flex-shrink: 0;
  height: 1.25rem;
  width: 1.25rem;
  color: ${colors.coolGray400};
`;

export const Chevron = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </Svg>
);
