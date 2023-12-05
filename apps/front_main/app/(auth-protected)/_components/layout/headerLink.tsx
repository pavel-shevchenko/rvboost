'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled, { css } from 'styled-components';

const StyledLink = styled.a`
  padding: 0.3rem;
  padding-bottom: 0.5rem;
  margin: 0.3rem;
  font-weight: 900;
  color: black;
  ${({ isActive }: { isActive: boolean }) =>
    isActive &&
    css`
      border-bottom: 3px blue solid;
    `}
  &:hover {
    border-bottom: 3px blue solid;
    color: black;
  }
`;

export const HeaderLink = ({ path, text }: { path: string; text: string }) => {
  const isActive = usePathname() === path;
  return (
    <Link href={path} passHref legacyBehavior>
      <StyledLink isActive={isActive}>{text}</StyledLink>
    </Link>
  );
};
