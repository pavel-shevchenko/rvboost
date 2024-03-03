'use client';

import { Subscription } from '@/services/typing/apiEntities';
import { useForm, Edit, Create } from '@refinedev/antd';
import { Checkbox, Form, Input, Select } from 'antd';
import moment from 'moment/moment';

export const PromoAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Subscription>();

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Код" name="code">
        <Input />
      </Form.Item>
      <Form.Item
        label="Статус активации"
        name="isActivated"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name={'activationDate'}
        label="Дата активации"
        getValueProps={(i) => ({
          value: moment(i).format('YYYY-MM-DDTHH:mm')
        })}
      >
        <input type="datetime-local" className="like-antd-input" />
      </Form.Item>
      <Form.Item
        label="Доступно компаний"
        name="locationsCnt"
        rules={[{ required: true }]}
      >
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
          title="Создание нового промокода"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Create>
      )}
      {isEdit && (
        <Edit
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Редактирование промокода"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Edit>
      )}
    </>
  );
};
