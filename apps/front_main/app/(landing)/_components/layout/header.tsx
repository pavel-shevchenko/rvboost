'use client';

import Headroom from 'react-headroom';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styled, { keyframes, css } from 'styled-components';

import { colors, breakpoints } from '@/app/_components/root-layout/styles';
import { ChevronDown } from '@/app/(landing)/_components/svgs';
import { LargeLogo } from '@/app/_components/common/svgs';
import { FlyoutMenu } from '@/app/(landing)/_components/layout/flyoutMenu';
import { MobileMenu } from '@/app/(landing)/_components/layout/mobileMenu';
import { PrimaryButton } from '@/app/_components/common/buttons';
import { useOutsideClick } from '@/services/hooks';
import { Routes } from '@/services/helpers/routes';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;
  height: 5rem;
  background-color: ${colors.white};
  @media (min-width: ${breakpoints.small}) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  @media (min-width: ${breakpoints.medium}) {
    justify-content: flex-start;
  }
  * {
    margin-right: 10px;
  }
`;

const LogoWrapper = styled.div`
  @media (min-width: ${breakpoints.large}) {
    width: 0;
    flex: 1 1 0%;
  }
`;

const MenuWrapper = styled.div`
  margin-right: -0.5rem;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
  @media (min-width: ${breakpoints.medium}) {
    display: none;
  }
`;

const MenuButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: ${colors.gray400};
  &:hover {
    color: ${colors.gray500};
    background-color: ${colors.gray100};
  }
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    color: ${colors.gray500};
    background-color: ${colors.gray100};
  }
`;

const MenuImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`;

const Nav = styled.nav`
  display: none;
  @media (min-width: ${breakpoints.medium}) {
    display: flex;
    justify-content: center;
    flex-basis: 60%;
  }
`;

const SolutionsWrapper = styled.div`
  position: relative;
`;

const fadeInUp = keyframes`
from {
  opacity: 0;
  transform: translateY(0.25rem);
}
to {
  opacity: 1;
  transform: translateY(0);
}
`;

const FlyoutMenuWrapper = styled.div`
  animation: ${fadeInUp} 0.3s ease-in forwards;
`;

const ButtonWrapper = styled.div`
  display: none;
  @media (min-width: ${breakpoints.medium}) {
    display: flex;
    flex: 1 1 0%;
  }
  @media (min-width: ${breakpoints.large}) {
    width: 0;
  }
  align-items: center;
  justify-content: flex-end;
  margin-left: 2rem;
`;

const SolutionsButton = styled.div`
  color: ${colors.gray500};
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  justify-content: space-between;
  font-size: 1rem;
  line-height: 1.5rem;
  cursor: pointer;

  &:hover {
    color: ${colors.gray900};
  }
  &:focus {
    color: ${colors.gray900};
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
`;

const StyledChevronDown = styled(ChevronDown)`
  margin-left: 8px;
  svg {
    color: ${colors.gray500};

    &:hover ${SolutionsButton} {
      color: ${colors.gray500};
    }
    &:focus ${SolutionsButton} {
      color: ${colors.gray500};
    }
  }
`;

const StyledLink = styled.a`
  margin-left: 2.5rem;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  font-size: 1.1rem;
  font-weight: 800;
  color: black;
  &::before {
    content: '';
    margin-bottom: -5px;
    position: absolute;
    width: 0;
    height: 6px;
    bottom: 0;
    left: 0;
    background-color: red;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    &::before {
      visibility: visible !important;
      width: 100%;
    }
  }

  ${({ isActive }: { isActive: boolean }) =>
    isActive &&
    css`
      margin-left: 2.5rem;
      text-decoration: none;
      cursor: pointer;
      position: relative;
      font-size: 1.1rem;
      font-weight: 800;
      color: black;
      &::before {
        content: '';
        margin-bottom: -5px;
        position: absolute;
        width: 0;
        height: 6px;
        bottom: 0;
        left: 0;
        background-color: red;
        visibility: visible;
        transition: all 0.3s ease-in-out;
        width: 100%;
      }
    `}
`;

export const Header = () => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  const refMobile = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [menu, toggleMenu] = useState(false);
  const [mobileMenu, toggleMobileMenu] = useState(false);

  const mobileMenuHandler = () =>
    mobileMenu ? toggleMobileMenu(false) : toggleMobileMenu(true);

  useOutsideClick(ref, () => toggleMenu(false));
  useOutsideClick(refMobile, () => toggleMobileMenu(false));

  return (
    <Headroom>
      <Container>
        <LogoWrapper>
          <Link href="/" legacyBehavior>
            <a>
              <LargeLogo />
            </a>
          </Link>
        </LogoWrapper>
        <MenuWrapper ref={refMobile}>
          <MenuButton onClick={mobileMenuHandler}>
            <MenuImage src="/icons/menu.svg" alt="menu" />
          </MenuButton>
          {mobileMenu ? (
            <MobileMenu mobileMenuHandler={mobileMenuHandler} />
          ) : null}
        </MenuWrapper>
        <Nav>
          <SolutionsWrapper onMouseOver={() => toggleMenu(true)} ref={ref}>
            <SolutionsButton>
              Solutions
              <StyledChevronDown height="1.25rem" width="1.25rem" />
            </SolutionsButton>

            {menu ? (
              <FlyoutMenuWrapper>
                <FlyoutMenu />
              </FlyoutMenuWrapper>
            ) : null}
          </SolutionsWrapper>

          <Link href="/pricing" passHref legacyBehavior>
            <StyledLink isActive={false}>Pricing</StyledLink>
          </Link>
        </Nav>
        <ButtonWrapper>
          <Link href={Routes.login} passHref legacyBehavior>
            <a>
              <PrimaryButton>Sign-In</PrimaryButton>
            </a>
          </Link>
        </ButtonWrapper>
      </Container>
    </Headroom>
  );
};
