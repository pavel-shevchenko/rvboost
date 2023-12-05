'use client';

import styled from 'styled-components';
import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import { useState } from 'react';
import { useWindowSize } from '@/services/hooks';
import {
  PrivateCabinetHeader,
  SidebarDesktop,
  SidebarMobile
} from '@/app/(auth-protected)/_components/layout';

const Wrapper = styled.div`
  background-color: ${colors.gray100};
  overflow: hidden;
  display: flex;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  /*width: 0;*/
  flex: 1 1 0%;
`;

const Main = styled.main`
  flex: 1 1 0%;
  z-index: 0;
  overflow-y: auto;
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
`;

const ContentWrapper = styled.div`
  padding-top: 1.5rem;
  margin-bottom: 1.5rem;
  margin-left: 3.5rem;
  margin-right: 3.5rem;
  .ant-popover-inner-content {
    padding: 0px;
    background-color: ${colors.midnight};
  }
`;

export function LayoutClientSide({ children }: { children: React.ReactNode }) {
  //handle antd sidebar rerender issue
  const windowSize = useWindowSize();
  const breakpoint = breakpoints.medium.substring(
    0,
    breakpoints.medium.length - 2
  );
  // @ts-ignore
  const isMobile = windowSize.width <= breakpoint;

  const [showMobileMenu, toggleShowMobileMenu] = useState(false);
  const [isDesktopMenuCollapsed, toggleIsDesktopMenuCollapsed] = useState(false);

  const mobileMenuHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    showMobileMenu ? toggleShowMobileMenu(false) : toggleShowMobileMenu(true);
  };
  const desktopMenuHandler = () =>
    isDesktopMenuCollapsed
      ? toggleIsDesktopMenuCollapsed(false)
      : toggleIsDesktopMenuCollapsed(true);
  const handleCollapseChange = isMobile ? mobileMenuHandler : desktopMenuHandler;

  return (
    <>
      <Wrapper>
        {!isMobile && <SidebarDesktop collapsed={isDesktopMenuCollapsed} />}
        <Content>
          <PrivateCabinetHeader
            collapsed={isDesktopMenuCollapsed}
            onCollapseChange={handleCollapseChange}
          />
          {showMobileMenu && (
            <SidebarMobile toggleMobileMenu={toggleShowMobileMenu} />
          )}
          <Main>
            {/*App Screens Here*/}
            <ContentWrapper theme="dark" id="primaryLayout">
              {children}
            </ContentWrapper>
          </Main>
        </Content>
      </Wrapper>
    </>
  );
}
