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

import { PermissionAction, PermissionSubject } from 'casl/src/legacy_typing';
import { Review } from '@/services/typing/entities';
import { Can } from '@/services/casl/common';

export default function ReviewList() {
  const { pageCount, tableProps } = useTable<Review>({
    pagination: { pageSize: 50 }
  });

  return (
    <List
      title="Список отзывов"
      headerButtons={
        <Can do={PermissionAction.create} on={PermissionSubject.entityReview}>
          <CreateButton>Новый отзыв</CreateButton>
        </Can>
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="Автор"
          render={(review) => {
            let info = '';
            if (review.authorName) info += `Имя: ${review.authorName}; `;
            if (review.authorEmail) info += `Email: ${review.authorEmail}; `;
            if (review.authorPhone) info += `Телефон: ${review.authorPhone}; `;

            return info;
          }}
        />
        <Table.Column dataIndex="reviewRating" title="Рейтинг" />
        <Table.Column
          dataIndex="publicationDatetime"
          title="Публикация отзыва от"
          render={(i) => moment(i).format('DD.MM.YYYY HH:mm')}
        />
        <Table.Column dataIndex="platform" title="Платформа" />
        <Table.Column dataIndex="location" title="ID компании" />
        <Table.Column<Review>
          title="Действия"
          dataIndex="actions"
          render={(_text, record): React.ReactNode => {
            return (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <Can
                  do={PermissionAction.delete}
                  on={PermissionSubject.entityReview}
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
