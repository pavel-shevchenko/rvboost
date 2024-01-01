'use client';

import { useUserStore } from '@/services/stores/user';
import { Routes } from '@/services/helpers/routes';
import {
  BankOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  MessageOutlined,
  ShoppingOutlined,
  PlusCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type SidebarMenuItem = {
  id: number;
  name: string;
  route: string;
  icon: React.ReactNode;
};

export const useSidebarMenu = () => {
  const [selectedId, setSelectedId] = useState<number>();
  const menus = getSidebarMenus();
  const pathname = usePathname();

  useEffect(() => {
    const menuActive = menus.find((menu) => menu.route.indexOf(pathname) === 0);
    if (menuActive?.id) setSelectedId(menuActive?.id);
  }, [menus, pathname]);

  return { menus, selectedId };
};

const getSidebarMenus = (): Array<SidebarMenuItem> => {
  const isAdmin = useUserStore((state) => state.isAdmin);

  return useMemo(() => {
    if (isAdmin === null)
      return [
        {
          id: 1,
          name: 'Информация',
          route: Routes.dashboard,
          icon: <DashboardOutlined />
        }
      ];

    if (isAdmin)
      return [
        {
          id: 1,
          name: 'Информация',
          route: Routes.dashboard,
          icon: <DashboardOutlined />
        },
        {
          id: 2,
          name: 'Новый клиент',
          route: Routes.newclient,
          icon: <PlusCircleOutlined />
        },
        {
          id: 3,
          name: 'Пользователи',
          route: Routes.users,
          icon: <UserOutlined />
        },
        {
          id: 4,
          name: 'Организации',
          route: Routes.companies,
          icon: <BankOutlined />
        },
        {
          id: 5,
          name: 'Компании',
          route: Routes.locations,
          icon: <ShoppingOutlined />
        },
        {
          id: 6,
          name: 'Карточки QR',
          route: Routes.cards,
          icon: <CreditCardOutlined />
        },
        {
          id: 8,
          name: 'Отзывы',
          route: Routes.reviews,
          icon: <MessageOutlined />
        }
      ];
    else
      return [
        {
          id: 1,
          name: 'Информация',
          route: Routes.dashboard,
          icon: <DashboardOutlined />
        },
        {
          id: 2,
          name: 'Компании',
          route: Routes.locations,
          icon: <ShoppingOutlined />
        },
        {
          id: 3,
          name: 'Карточки QR',
          route: Routes.cards,
          icon: <CreditCardOutlined />
        }
      ];
  }, [isAdmin]);
};
