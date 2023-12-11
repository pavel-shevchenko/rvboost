'use client';

import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton
} from '@refinedev/antd';
import { Table, Space } from 'antd';

import { Organization, User } from '@/services/typing/entities';

export default function OrganizationList() {
  const { pageCount, tableProps } = useTable<Organization>({
    pagination: { pageSize: 50 }
  });

  return (
    <List
      title="Организации"
      headerButtons={<CreateButton>Новая организация</CreateButton>}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Название" />
        <Table.Column
          dataIndex="users"
          title="ID клиента"
          render={(v) => v?.pop()}
        />
        <Table.Column<User>
          title="Действия"
          dataIndex="actions"
          render={(_text, record): React.ReactNode => {
            return (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
}
