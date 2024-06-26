'use client';

import { redirect, usePathname } from 'next/navigation';
import { env } from 'next-runtime-env';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Refine } from '@refinedev/core';
import { RefineThemes, notificationProvider } from '@refinedev/antd';
import dataProvider from '@refinedev/nestjsx-crud';
import routerProvider from '@refinedev/nextjs-router/app';
import { ConfigProvider } from 'antd';

import { defineUserAbility } from 'casl/src/defineUserAbility';
import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import { useWindowSize } from '@/services/hooks';
import {
  InitUserStoreAndCrudAuthOnClient,
  PrivateCabinetHeader,
  SidebarDesktop,
  SidebarMobile
} from '@/app/(auth-protected)/_components/layout';
import { Routes } from '@/services/helpers/routes';
import { CaslContext } from '@/services/casl/common';
import { UserStoreState } from '@/services/stores/user';

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

export function LayoutClientSide({
  children,
  userInitState
}: {
  children: React.ReactNode;
  userInitState: UserStoreState | undefined;
}) {
  if (
    userInitState &&
    !userInitState.isAdmin &&
    !userInitState.isAssignedToOrg &&
    usePathname() !== Routes.startClient
  )
    redirect(Routes.startClient);

  const ability = useMemo(
    () => userInitState && defineUserAbility(userInitState),
    [userInitState]
  );
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
      <InitUserStoreAndCrudAuthOnClient userInitState={userInitState} />

      {ability && (
        <CaslContext.Provider value={ability}>
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
                  <ContentWrapper id="primaryLayout">
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
                          edit: `${Routes.users}/edit/:id`
                        },
                        {
                          name: 'organization',
                          list: Routes.companies,
                          create: `${Routes.companies}/create`,
                          edit: `${Routes.companies}/edit/:id`
                        },
                        {
                          name: 'subscription',
                          list: Routes.subscriptions,
                          create: `${Routes.subscriptions}/create`,
                          edit: `${Routes.subscriptions}/edit/:id`
                        },
                        {
                          name: 'promocodes',
                          list: Routes.promocodes,
                          create: `${Routes.promocodes}/create`,
                          edit: `${Routes.promocodes}/edit/:id`
                        },
                        {
                          name: 'analytics',
                          list: Routes.analytics,
                          create: `${Routes.analytics}/create`,
                          edit: `${Routes.analytics}/edit/:id`
                        },
                        {
                          name: 'location',
                          list: Routes.locations,
                          create: `${Routes.locations}/create`,
                          edit: `${Routes.locations}/edit/:id`
                        },
                        {
                          name: 'card',
                          list: Routes.cards,
                          create: `${Routes.cards}/create`,
                          edit: `${Routes.cards}/edit/:id`
                        },
                        {
                          name: 'review',
                          list: Routes.reviews,
                          create: `${Routes.reviews}/create`,
                          edit: `${Routes.reviews}/edit/:id`
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
        </CaslContext.Provider>
      )}
    </>
  );
}
