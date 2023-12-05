'use client';

import styled, { css } from 'styled-components';
import { useRouter } from 'next/navigation';
import { Menu, Layout, Avatar, Popover, Badge, List, Button, Space } from 'antd';
import {
  RightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { IoNotificationsOutline } from 'react-icons/io5';
import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import { Routes } from '@/services/helpers/routes';
import { useUserStore } from '@/services/stores/user';

const LayoutHeader = styled(Layout.Header)`
  @media (max-width: ${breakpoints.medium}) {
    width: 100% !important;
  }
  padding: 0;
  box-shadow: 4px 4px 40px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  height: 72px;
  z-index: 9;
  align-items: center;
  background-color: ${colors.white};
  transition: width 0.2s;

  .ant-menu-submenu-title {
    height: 72px;
  }

  .ant-menu-horizontal {
    line-height: 72px;

    & > .ant-menu-submenu:hover {
      color: ${colors.dodgerBlue};
      background-color: ${colors.firefly};
    }
  }

  .ant-menu {
    border-bottom: none;
    height: 72px;
  }

  .ant-menu-horizontal > .ant-menu-submenu {
    top: 0;
    margin-top: 0;
  }

  .ant-menu-horizontal > .ant-menu-item,
  .ant-menu-horizontal > .ant-menu-submenu {
    border-bottom: none;
  }

  .ant-menu-horizontal > .ant-menu-item-active,
  .ant-menu-horizontal > .ant-menu-item-open,
  .ant-menu-horizontal > .ant-menu-item-selected,
  .ant-menu-horizontal > .ant-menu-item:hover,
  .ant-menu-horizontal > .ant-menu-submenu-active,
  .ant-menu-horizontal > .ant-menu-submenu-open,
  .ant-menu-horizontal > .ant-menu-submenu-selected,
  .ant-menu-horizontal > .ant-menu-submenu:hover {
    border-bottom: none;
  }
  background-color: ${colors.midnight};
`;

const CollapseButton = styled.div`
  width: 72px;
  height: 72px;
  line-height: 72px;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease-out;
  color: ${colors.white};

  &:hover {
    color: ${colors.dodgerBlue};
    background-color: ${colors.firefly};
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledPopover = styled(Popover)`
  .ant-popover-arrow {
    display: none;
  }
  .ant-list-item-content {
    flex: 0;
    margin-left: 16px;
  }
`;

const StyledAvatar = styled(Avatar)`
  margin-left: 1rem;
  margin-bottom: 0.5rem;
`;

const AvatarWrapper = styled.div`
  margin-right: 1rem;
`;

const Notification = styled.div`
  padding: 1rem;
  width: 320px;
`;

const ClearButton = styled.div`
  text-align: center;
  height: 48px;
  line-height: 48px;
  cursor: pointer;
  color: ${colors.silver};
  &:hover {
    background-color: ${colors.firefly};
  }
`;

const NotificationItem = styled(List.Item)`
  transition: all 0.3s;
  padding: 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${colors.firefly};
  }
`;

const StyledRightOutlined = styled(RightOutlined)`
  font-size: 10px;
  color: ${colors.silver};
`;

const IconButton = styled(Button)`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  cursor: pointer;
  margin-right: 0.5rem;
  & + .iconButton {
    margin-left: 8px;
  }
`;

const IconFont = styled(IoNotificationsOutline)`
  color: ${colors.cadetBlue};
  font-size: 24px;
  &:hover {
    color: ${colors.dodgerBlue};
  }
`;

const ListItemMeta = styled(List.Item.Meta)`
  h4 {
    color: ${colors.silver};
  }
  div.ant-list-item-meta-description {
    color: ${colors.whisper};
  }
`;

export const PrivateCabinetHeader = ({
  collapsed,
  onCollapseChange
}: {
  collapsed: boolean;
  onCollapseChange: (e: React.MouseEvent<HTMLElement>) => void;
}) => {
  const router = useRouter();
  const userStoreLogout = useUserStore((state) => state.logout);
  const username = useUserStore((state) => state.username);

  const logout = () => {
    userStoreLogout();
    router.push(Routes.login);
  };

  return (
    <div>
      <LayoutHeader id="layoutHeader">
        <CollapseButton onClick={onCollapseChange}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </CollapseButton>
        <RightContainer>
          <Menu
            key="user"
            mode="horizontal"
            theme="dark"
            items={[
              {
                label: (
                  <AvatarWrapper>
                    <StyledAvatar icon={<UserOutlined />} />
                  </AvatarWrapper>
                ),
                key: 'submenu',
                children: [
                  {
                    label: <a>Logged in as {username}</a>,
                    disabled: true,
                    key: 'Loggedin'
                  },
                  {
                    label: <a href="/user/dashboard">Профиль</a>,
                    icon: <UserOutlined />,
                    key: 'user'
                  },
                  {
                    label: <a onClick={logout}>Sign Out</a>,
                    icon: <LogoutOutlined />,
                    key: 'SignOut'
                  }
                ]
              }
            ]}
          ></Menu>
        </RightContainer>
      </LayoutHeader>
    </div>
  );
};
