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

import { Card, User } from '@/services/typing/entities';

export default function CardList() {
  const { pageCount, tableProps } = useTable<Card>({
    pagination: { pageSize: 50 }
  });

  return (
    <List
      title="Карточки QR"
      headerButtons={<CreateButton>Новая карточка QR</CreateButton>}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="isReviewInterception"
          title="Перехват отзыва"
          render={(v) => (v ? 'Да' : '–')}
        />
        <Table.Column
          dataIndex="redirectPlatform"
          title="Платформа переадресации"
        />
        <Table.Column
          dataIndex="isCustomLinkRedirect"
          title="Переадресация по кастомной ссылке"
          render={(v) => (v ? 'Да' : '–')}
        />
        <Table.Column dataIndex="linkCustom" title="Кастомная ссылка" />
        <Table.Column dataIndex="location" title="ID компании" />
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
