import styled from 'styled-components';
import { colors } from '@/app/_components/root-layout/styles';

const Wrapper = styled.div`
  padding: 1rem;
  color: ${colors.gray500};
  text-align: center;
`;

export const AuthFooter = () => {
  return <Wrapper>Footer</Wrapper>;
};
