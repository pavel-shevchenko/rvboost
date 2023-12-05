import styled from 'styled-components';
import { breakpoints } from '@/app/_components/root-layout/styles';
import { SmallLogo } from '@/app/_components/common/svgs';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.7rem;
  @media (min-width: ${breakpoints.small}) {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 28rem;
  }
`;

export const AuthHeader = () => {
  return (
    <Wrapper>
      <SmallLogo height={50} width={59} />
    </Wrapper>
  );
};
