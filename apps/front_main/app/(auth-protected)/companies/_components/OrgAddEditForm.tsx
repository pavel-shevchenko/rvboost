'use client';

import { Location } from '@/services/typing/entities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Button, Form, Input, Select } from 'antd';
import { Organization, User } from '@/services/typing/entities';
import { downloadOrganizationQR } from '@/services/helpers/downloadOrganizationQR';

export const OrgAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Organization>();

  const { selectProps: userSelectProps } = useSelect<User>({
    resource: 'user',
    optionLabel: 'id' // 'email'
  });

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Название" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="ID клиента"
        name={['user', 'id']}
        rules={[{ required: true }]}
      >
        <Select {...userSelectProps} />
      </Form.Item>
    </Form>
  );

  return (
    <>
      {!isEdit && (
        <Create
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Создание новой организации"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Create>
      )}
      {isEdit && (
        <Edit
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Редактирование организации"
          saveButtonProps={saveButtonProps}
          headerButtons={
            <Button
              onClick={() =>
                downloadOrganizationQR(
                  queryResult?.data?.data?.locations as Location[]
                )
              }
            >
              Скачать QR-коды zip-архивом
            </Button>
          }
        >
          {commonForm}
        </Edit>
      )}
    </>
  );
};
