'use client';

import { useTable, List } from '@refinedev/antd';
import { Table } from 'antd';

import { Card } from '@/services/typing/apiEntities';
import { getQrImageLink, getShortLink } from 'business/src/index';

export default function CardList() {
  const { pageCount, tableProps } = useTable<Card>({
    resource: 'card',
    pagination: { pageSize: 50 }
  });

  return (
    <List title="Шортссылки">
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="shortLinkCode"
          title="Short link"
          render={(code) => (
            <div style={{ width: 'auto' }}>{getShortLink(code)}</div>
          )}
        />
        <Table.Column
          dataIndex="shortLinkCode"
          title="QR media link"
          render={(code) => (
            <div style={{ width: 'auto' }}>{getQrImageLink(code)}</div>
          )}
        />
      </Table>
    </List>
  );
}
