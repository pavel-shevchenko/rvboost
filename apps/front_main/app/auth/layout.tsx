'use client';

import styled from 'styled-components';
import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import { AuthFooter, AuthHeader } from '@/app/auth/_components/layout';

const Wrapper = styled.div`
  background-color: ${colors.gray50};
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (min-width: ${breakpoints.small}) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  @media (min-width: ${breakpoints.large}) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <AuthHeader />
      <div>{children}</div>
      <AuthFooter />
    </Wrapper>
  );
}
