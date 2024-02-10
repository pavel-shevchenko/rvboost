'use client';

import moment from 'moment/moment';
import { Event, Card } from '@/services/typing/apiEntities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Form, Input, Select } from 'antd';
import { EventEnum } from 'typing/src/enums';
import { eventLabels } from '@/services/helpers/analyticsEventLabels';

const events = Object.keys(EventEnum).map((event) => ({
  // @ts-ignore
  label: eventLabels[event],
  value: event
}));

export const AnalyticsAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Event>();

  const { selectProps: cardSelectProps } = useSelect<Card>({
    resource: 'card',
    optionLabel: 'id'
  });

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item
        name={'createdAt'}
        label="Дата и время"
        getValueProps={(i) => ({
          value: moment(i).format('YYYY-MM-DDTHH:mm')
        })}
        rules={[{ required: true }]}
      >
        <input type="datetime-local" className="like-antd-input" />
      </Form.Item>
      <Form.Item label="Тип действия" name="eventType">
        <Select options={events} />
      </Form.Item>
      <Form.Item label="ID QR" name={['card']} rules={[{ required: true }]}>
        <Select {...cardSelectProps} />
      </Form.Item>
    </Form>
  );

  return (
    <>
      {!isEdit && (
        <Create
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Создание новой записи"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Create>
      )}
      {isEdit && (
        <Edit
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Редактирование записи"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Edit>
      )}
    </>
  );
};
