'use client';

import { Organization, User } from '@/services/typing/entities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Form, Input, Select } from 'antd';

export const OrgAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Organization>();

  const { selectProps: userSelectProps } = useSelect<User>({
    resource: 'user',
    optionLabel: 'id' // 'email'
  });

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Название" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="ID клиента" name={['user', 'id']}>
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
        >
          {commonForm}
        </Edit>
      )}
    </>
  );
};
