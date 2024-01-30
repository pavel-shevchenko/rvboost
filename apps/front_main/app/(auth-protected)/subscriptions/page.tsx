'use client';

import {
  useTable,
  List,
  EditButton,
  DeleteButton,
  CreateButton
} from '@refinedev/antd';
import { Table, Space } from 'antd';
import moment from 'moment/moment';

import { Subscription } from '@/services/typing/apiEntities';

export default function SubscriptionList() {
  const { pageCount, tableProps } = useTable<Subscription>({
    pagination: { pageSize: 50 }
  });

  return (
    <List
      title="Подписки"
      headerButtons={<CreateButton>Новая подписка</CreateButton>}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="validUntil"
          title="Действует до"
          render={(i) => moment(i).format('DD.MM.YYYY HH:mm')}
        />
        <Table.Column dataIndex="organization" title="ID организации" />
        <Table.Column<Subscription>
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
