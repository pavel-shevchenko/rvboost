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

import { User } from '@/services/typing/entities';

export default function UserList() {
  const { pageCount, tableProps } = useTable<User>({
    pagination: { pageSize: 50 }
  });

  return (
    <List
      title="Пользователи"
      headerButtons={<CreateButton>Новый пользователь</CreateButton>}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="username" title="Имя" />
        <Table.Column
          dataIndex="isAdmin"
          title="Права админа"
          render={(v) => (v ? 'Да' : '–')}
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
