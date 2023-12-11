'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Refine } from '@refinedev/core';
import { RefineThemes, notificationProvider } from '@refinedev/antd';
import dataProvider from '@refinedev/nestjsx-crud';
import routerProvider from '@refinedev/nextjs-router/app';
import { ConfigProvider } from 'antd';
import { env } from 'next-runtime-env';

import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import { useWindowSize } from '@/services/hooks';
import {
  PrivateCabinetHeader,
  SidebarDesktop,
  SidebarMobile
} from '@/app/(auth-protected)/_components/layout';
import { Routes } from '@/services/helpers/routes';

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
            <ConfigProvider theme={RefineThemes.Blue}>
              <ContentWrapper theme="dark" id="primaryLayout">
                <Refine
                  routerProvider={routerProvider}
                  dataProvider={dataProvider(
                    `${env('NEXT_PUBLIC_SERVER_URL')}/api`
                  )}
                  resources={[
                    {
                      name: 'user',
                      list: Routes.users,
                      create: `${Routes.users}/create`,
                      edit: `${Routes.users}/edit/:id`,
                      meta: {
                        canDelete: true
                      }
                    },
                    {
                      name: 'organization',
                      list: Routes.companies,
                      create: `${Routes.companies}/create`,
                      edit: `${Routes.companies}/edit/:id`,
                      meta: {
                        canDelete: true
                      }
                    }
                  ]}
                  options={{
                    syncWithLocation: true
                  }}
                  notificationProvider={notificationProvider}
                >
                  {children}
                </Refine>
              </ContentWrapper>
            </ConfigProvider>
          </Main>
        </Content>
      </Wrapper>
    </>
  );
}
