import { useEffect, useState } from 'react';
import { Button, Popconfirm, Space, Table } from 'antd';
import { useUserStore } from '@/services/stores/user';
import { useFetch } from '@/services/hooks';
import { env } from 'next-runtime-env';
import { CreateButton, EditButton } from '@refinedev/antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Routes } from '@/services/helpers/routes';

export default function ListTable() {
  const router = useRouter();
  const [dataSource, setDataSource] = useState<
    Array<{ id: number; organization: number }>
  >([]);
  const authToken = useUserStore((state) => state.authToken);
  const fetch = useFetch(authToken);

  const reload = async () => {
    if (!authToken) return;

    const initValues = await fetch.get(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/review/feedback-settings-list`
    );
    setDataSource(initValues);
  };

  useEffect(() => {
    reload();
  }, [authToken]);

  const remove = async (id: number) => {
    await fetch.delete(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/review/feedback-settings/${id}`
    );
    reload();
  };

  return (
    <>
      <div style={{ float: 'right' }}>
        <CreateButton onClick={() => router.push(Routes.fbSettingsCreate)}>
          Новая конфигурация формы
        </CreateButton>
      </div>
      <Table {...{ dataSource }} pagination={false} rowKey="id">
        <Table.Column dataIndex="organization" title="ID организации" />
        <Table.Column
          title="Действия"
          dataIndex="actions"
          render={(_text, record): React.ReactNode => {
            return (
              <Space>
                <EditButton
                  hideText
                  size="small"
                  // @ts-ignore
                  onClick={() => router.push(Routes.fbSettingsEdit(record.id))}
                />

                <Popconfirm
                  key="delete"
                  okText="Delete"
                  cancelText="Cancel"
                  okType="danger"
                  title="Are you sure?"
                  // @ts-ignore
                  onConfirm={() => remove(record.id)}
                >
                  <Button danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
              </Space>
            );
          }}
        />
      </Table>
    </>
  );
}
