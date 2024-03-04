'use client';

import { useForm, Edit, Create } from '@refinedev/antd';
import { Form, Input, Checkbox, Typography } from 'antd';

import { User } from '@/services/typing/apiEntities';

export const UserAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<User>();

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Имя" name="username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Пароль" name="password">
        <Input />
      </Form.Item>
      <Form.Item label="Права админа" name="isAdmin" valuePropName="checked">
        <Checkbox />
      </Form.Item>
      <Form.Item label="Промокод при регистрации" name="promoRegedCode">
        <Input />
      </Form.Item>
      <Typography.Title level={5} style={{ marginBottom: '15px' }}>
        Информация по доставке карты:
      </Typography.Title>
      <Form.Item label="Страна доставки" name="promoRegedCountry">
        <Input />
      </Form.Item>
      <Form.Item label="Город" name="promoRegedCity">
        <Input />
      </Form.Item>
      <Form.Item label="Адрес" name="promoRegedAddress">
        <Input />
      </Form.Item>
      <Form.Item label="Почтовый индекс" name="promoRegedZip">
        <Input />
      </Form.Item>
      <Form.Item label="Имя получателя" name="promoRegedName">
        <Input />
      </Form.Item>
      <Form.Item label="Фамилия получателя" name="promoRegedSurname">
        <Input />
      </Form.Item>
      <Form.Item label="Номер телефона получателя" name="promoRegedPhone">
        <Input />
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
