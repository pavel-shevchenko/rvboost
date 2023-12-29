'use client';

import styled from 'styled-components';
import ScrollBar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Layout, Menu } from 'antd';
import Link from 'next/link';

import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import { LargeLogo, SmallLogo } from '@/app/_components/common/svgs';
import { useSidebarMenu } from '@/services/hooks';

const StyledIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.8rem;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;

  .anticon {
    line-height: 27px !important;
  }
`;

const StyledSider = styled(Layout.Sider)`
  display: none;
  background-color: ${colors.midnight};

  @media (min-width: ${breakpoints.medium}) {
    display: initial;
  }
  box-shadow: fade(${colors.doveGray}, 10%) 0 0 28px 0;
  z-index: 10;
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 72px;
  box-shadow: 0 1px 9px -3px rgba(0, 0, 0, 0.2);
`;

const SidebarItems = styled.div`
  height: calc(100vh - 120px);
  overflow-x: hidden;
  flex: 1;
  padding: 24px 0;

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  .ant-menu-inline {
    border-right: none;
  }
`;

const StyledLink = styled.a`
  display: flex;
`;

const ItemWrapper = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

const Footer = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  overflow: hidden;
  transition: all 0.3s;

  span {
    white-space: nowrap;
    overflow: hidden;
    font-size: 12px;
  }

  .anticon {
    min-width: 14px;
    margin-right: 4px;
    font-size: 14px;
  }
`;

export const SidebarDesktop = ({ collapsed }: { collapsed: boolean }) => {
  const { menus, selectedId } = useSidebarMenu();

  return (
    <StyledSider
      width={200}
      breakpoint="lg"
      trigger={null}
      theme="dark"
      collapsible
      collapsed={collapsed}
    >
      <LogoWrapper>
        {collapsed ? <SmallLogo /> : <LargeLogo textColor={colors.white} />}
      </LogoWrapper>
      <SidebarItems>
        <ScrollBar options={{ suppressScrollX: true }}>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[selectedId?.toString() || '']}
            items={menus.map(({ id, route, icon, name }) => ({
              key: id,
              title: name,
              label: (
                <Link href={route || '#'} passHref legacyBehavior>
                  <StyledLink>
                    <StyledIcon>{icon}</StyledIcon>
                    {!collapsed && <ItemWrapper>{name}</ItemWrapper>}
                  </StyledLink>
                </Link>
              )
            }))}
          ></Menu>
        </ScrollBar>
      </SidebarItems>

      {!collapsed && <Footer></Footer>}
    </StyledSider>
  );
};
