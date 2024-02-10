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

import { Event } from '@/services/typing/apiEntities';
import { eventLabels } from '@/services/helpers/analyticsEventLabels';

export default function EventList() {
  const { pageCount, tableProps } = useTable<Event>({
    pagination: { pageSize: 50 }
  });

  return (
    <List
      title="Аналитика"
      headerButtons={<CreateButton>Новая запись</CreateButton>}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="createdAt"
          title="Дата и время"
          render={(i) => moment(i).format('DD.MM.YYYY HH:mm')}
        />
        <Table.Column dataIndex="card" title="ID QR" />
        <Table.Column
          dataIndex="eventType"
          title="Тип действия"
          // @ts-ignore
          render={(i) => eventLabels[i]}
        />
        <Table.Column<Event>
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
