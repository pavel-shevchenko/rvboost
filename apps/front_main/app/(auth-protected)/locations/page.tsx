'use client';

import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton
} from '@refinedev/antd';
import { useContext } from 'react';
import { Table, Space } from 'antd';

import { Location, User } from '@/services/typing/entities';
import { PermissionAction, PermissionSubject } from 'casl/src/legacy_typing';
import { Can, CaslContext } from '@/services/casl/common';

export default function LocationList() {
  const ctxCan = useContext(CaslContext);
  const { pageCount, tableProps } = useTable<Location>({
    pagination: { pageSize: 50 }
  });

  return (
    <List
      title="Компании"
      headerButtons={
        <Can do={PermissionAction.create} on={PermissionSubject.entityLocation}>
          <CreateButton>Новая компания</CreateButton>
        </Can>
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
        <Table.Column<User>
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
