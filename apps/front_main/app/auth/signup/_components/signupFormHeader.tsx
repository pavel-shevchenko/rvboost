import styled from 'styled-components';
import Link from 'next/link';
import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import { AuthTitle } from '@/app/auth/_components';
import { Routes } from '@/services/helpers/routes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (min-width: ${breakpoints.small}) {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 32rem;
  }
`;

const AltText = styled.div`
  text-align: center;
  padding-bottom: 2rem;
  color: ${colors.gray500};
`;

export const SignupFormHeader = () => (
  <Wrapper>
    <AuthTitle>Sign-Up for an Account</AuthTitle>
    <AltText>
      <Link href={Routes.login} legacyBehavior>
        <a>Already Have an Account? Login here</a>
      </Link>
    </AltText>
  </Wrapper>
);
