'use client';

import { Subscription, Organization } from '@/services/typing/entities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Form, Input, Select } from 'antd';
import moment from 'moment/moment';

export const SubscrAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Subscription>();

  const { selectProps: orgSelectProps } = useSelect<Organization>({
    resource: 'organization',
    optionLabel: 'id'
  });

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item
        name={'validUntil'}
        label="Действует до"
        getValueProps={(i) => ({
          value: moment(i).format('YYYY-MM-DDTHH:mm')
        })}
        rules={[{ required: true }]}
      >
        <input type="datetime-local" className="like-antd-input" />
      </Form.Item>
      <Form.Item
        label="ID организации"
        name={['organization']}
        rules={[{ required: true }]}
      >
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
