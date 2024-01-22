'use client';

import styled from 'styled-components';
import { breakpoints, colors } from '@/app/_components/root-layout/styles';

const Wrapper = styled.div`
  background-color: ${colors.gray50};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;

  @media (min-width: ${breakpoints.small}) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  @media (min-width: ${breakpoints.large}) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <div>{children}</div>
    </Wrapper>
  );
}
