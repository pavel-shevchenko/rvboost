'use client';

import {
  useTable,
  List,
  EditButton,
  DeleteButton,
  CreateButton
} from '@refinedev/antd';
import { useContext } from 'react';
import { Table, Space } from 'antd';

import { Card } from '@/services/typing/entities';
import { PermissionAction, PermissionSubject } from 'casl/src/legacy_typing';
import { Can, CaslContext } from '@/services/casl/common';

export default function CardList() {
  const ctxCan = useContext(CaslContext);
  const { pageCount, tableProps } = useTable<Card>({
    pagination: { pageSize: 50 }
  });

  return (
    <List
      title="Карточки QR"
      headerButtons={
        <Can do={PermissionAction.create} on={PermissionSubject.entityCard}>
          <CreateButton>Новая карточка QR</CreateButton>
        </Can>
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="isReviewInterception"
          title="Перехват отзыва"
          render={(v) => (v ? 'Да' : '–')}
        />
        {ctxCan.can(
          PermissionAction.viewDetailsOnList,
          PermissionSubject.entityCard
        ) && (
          <>
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
          </>
        )}
        <Table.Column dataIndex="location" title="ID компании" />
        <Table.Column<Card>
          title="Действия"
          dataIndex="actions"
          render={(_text, record): React.ReactNode => {
            return (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <Can
                  do={PermissionAction.delete}
                  on={PermissionSubject.entityCard}
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
