'use client';

import React from 'react';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { colors } from '@/app/_components/root-layout/styles';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.25rem;
  color: ${colors.silver};
  padding: 0 16px 0 24px;
  margin: 4px 0 8px;
  height: 40px;
  &:hover {
    color: ${colors.dodgerBlue};
  }
  &:focus {
    color: ${colors.dodgerBlue};
    background-color: ${colors.lilyWhite};
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  ${({ isActive }: { isActive: boolean }) =>
    isActive &&
    css`
      color: ${colors.dodgerBlue};
      background-color: ${colors.lilyWhite};
      outline: 2px solid transparent;
      outline-offset: 2px;
    `}
`;

const SvgWrapper = styled.div`
  margin-right: 10px;
`;

const TitleWrapper = styled.span`
  font-size: 15px;
  font-weight: 500;
`;

export const MobileSidebarItem = ({
  link,
  toggleMenu,
  svg,
  title,
  isActive
}: {
  link: string;
  toggleMenu: () => void;
  svg: React.ReactNode;
  title: string;
  isActive: boolean;
}) => (
  <Link href={link}>
    <Wrapper {...{ isActive }} onClick={toggleMenu}>
      <SvgWrapper>{svg}</SvgWrapper>
      <TitleWrapper>{title}</TitleWrapper>
    </Wrapper>
  </Link>
);
