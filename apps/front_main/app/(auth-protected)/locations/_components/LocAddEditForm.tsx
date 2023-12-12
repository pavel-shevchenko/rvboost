'use client';

import { Location, User } from '@/services/typing/entities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Form, Input, Select } from 'antd';

export const LocAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Location>();

  const { selectProps: orgSelectProps } = useSelect<User>({
    resource: 'organization',
    optionLabel: 'id'
  });

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Название" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Адрес" name="address">
        <Input />
      </Form.Item>
      <Form.Item label="Ссылка на Google" name="linkGoogle">
        <Input />
      </Form.Item>
      <Form.Item label="Ссылка на TrustPilot" name="linkTrustPilot">
        <Input />
      </Form.Item>
      <Form.Item label="Default Ссылка" name="linkDefault">
        <Input />
      </Form.Item>
      <Form.Item label="ID организации" name={['organization']}>
        <Select {...orgSelectProps} />
      </Form.Item>
    </Form>
  );

  return (
    <>
      {!isEdit && (
        <Create
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Создание новой компании"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Create>
      )}
      {isEdit && (
        <Edit
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Редактирование компании"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Edit>
      )}
    </>
  );
};
