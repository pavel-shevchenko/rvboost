import styled from 'styled-components';
import { breakpoints } from '@/app/_components/root-layout/styles';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: -17rem;
  @media (min-width: ${breakpoints.small}) {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 28rem;
  }
`;

const Title = styled.h2`
  padding-right: 2rem;
  padding-left: 2rem;
  color: green;
  text-align: center;
  font-weight: 400;
  font-size: 1.5rem;
`;

export const ResetSuccess = () => (
  <Wrapper>
    <Title>Ссылка для восстановления была отправлена на ваш Email</Title>
  </Wrapper>
);
