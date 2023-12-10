'use client';

import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton
} from '@refinedev/antd';
import { Table, Space } from 'antd';

const PostList: React.FC = () => {
  const { pageCount, tableProps } = useTable<User>({
    pagination: { pageSize: 50 }
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="username" title="Name" />
        <Table.Column<User>
          title="Actions"
          dataIndex="actions"
          render={(_text, record): React.ReactNode => {
            return (
              <Space>
                <EditButton size="small" recordItemId={record.id} />
                <ShowButton size="small" recordItemId={record.id} />
                <DeleteButton size="small" recordItemId={record.id} />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};

export default PostList;
