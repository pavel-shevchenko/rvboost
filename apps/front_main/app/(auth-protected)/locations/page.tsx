'use client';

import {
  useTable,
  List,
  EditButton,
  DeleteButton,
  CreateButton
} from '@refinedev/antd';
import { useContext, useEffect, useState } from 'react';
import { Table, Space } from 'antd';

import { Location } from '@/services/typing/apiEntities';
import { PermissionAction, PermissionSubject } from 'casl/src/legacy_typing';
import { Can, CaslContext } from '@/services/casl/common';
import { useUserStore } from '@/services/stores/user';

export default function LocationList() {
  const ctxCan = useContext(CaslContext);
  const { pageCount, tableProps } = useTable<Location>({
    pagination: { pageSize: 50 }
  });

  const authToken = useUserStore((state) => state.authToken);
  const lUaPt = useUserStore((state) => state.loadUserAndPersistToken);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    const init = async () => {
      const curUser = await lUaPt(authToken);
      const curDatetime = new Date();

      if (curUser?.isAdmin) setCanCreate(true);

      for (const organization of curUser?.organizations || []) {
        for (const subscription of organization?.subscriptions || []) {
          if (
            new Date(subscription?.validUntil) > curDatetime &&
            organization?.locations?.length &&
            organization.locations.length < subscription?.locationsCnt
          ) {
            setCanCreate(true);
          }
        }
      }
    };
    if (authToken) init();
  }, [authToken]);

  return (
    <List
      title="Компании"
      headerButtons={
        canCreate ? <CreateButton>Новая компания</CreateButton> : <></>
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Название" />
        <Table.Column dataIndex="address" title="Адрес" />
        {ctxCan.can(
          PermissionAction.read,
          PermissionSubject.entityLocation,
          'organization'
        ) && <Table.Column dataIndex="organization" title="ID организации" />}
        <Table.Column dataIndex="reviewsCount" title="Reviews count" />
        <Table.Column
          dataIndex="avgRating"
          title="Avg. Rating"
          render={(i) => Math.round(i * 100) / 100}
        />
        <Table.Column dataIndex="externalFollowedEventsCount" title="QR Cliks" />
        <Table.Column<Location>
          title="Действия"
          dataIndex="actions"
          render={(_text, record): React.ReactNode => {
            return (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <Can
                  do={PermissionAction.delete}
                  on={PermissionSubject.entityLocation}
                >
                  <DeleteButton hideText size="small" recordItemId={record.id} />
                </Can>
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
}
