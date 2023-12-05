import styled from 'styled-components';
import { colors } from '@/app/_components/root-layout/styles';

export const FieldLabel = styled.label`
  input {
    margin-top: 0.5rem;
  }
  display: block;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${colors.gray700};
`;
