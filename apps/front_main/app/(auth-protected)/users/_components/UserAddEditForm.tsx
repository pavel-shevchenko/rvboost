'use client';

import { useForm, Edit, Create } from '@refinedev/antd';
import { Form, Input, Checkbox } from 'antd';

import { User } from '@/services/typing/entities';

export const UserAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<User>();

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <Form.Item label="Имя" name="username">
        <Input />
      </Form.Item>
      <Form.Item label="Пароль" name="password">
        <Input />
      </Form.Item>
      <Form.Item label="Права админа" name="isAdmin" valuePropName="checked">
        <Checkbox />
      </Form.Item>
    </Form>
  );

  return (
    <>
      {!isEdit && (
        <Create
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Создание нового пользователя"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Create>
      )}
      {isEdit && (
        <Edit
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Редактирование пользователя"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Edit>
      )}
    </>
  );
};
