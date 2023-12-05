import styled from 'styled-components';
import { AuthTitle } from '@/app/auth/_components';
import { breakpoints } from '@/app/_components/root-layout/styles';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -7rem;
  @media (min-width: ${breakpoints.small}) {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 28rem;
  }
`;

export const ForgotPassFormHeader = () => (
  <Wrapper>
    <AuthTitle>Введите Email для восстановления пароля</AuthTitle>
  </Wrapper>
);
