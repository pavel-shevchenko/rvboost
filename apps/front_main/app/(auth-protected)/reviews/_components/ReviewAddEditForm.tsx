'use client';

import { Review, User } from '@/services/typing/entities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Checkbox, Form, Input, Select } from 'antd';
import { RedirectPlatformEnum } from 'typing/src/enums';
import moment from 'moment';

const redirectPlatforms = Object.keys(RedirectPlatformEnum).map((platform) => ({
  label: platform,
  value: platform
}));

export const ReviewAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Review>();

  const { selectProps: locSelectProps } = useSelect<User>({
    resource: 'location',
    optionLabel: 'id'
  });

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="Признак отзыва собранного через форму запроса плохого отзыва"
        name="isBadFormCollected"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item label="Имя автора отзыва" name="authorName">
        <Input />
      </Form.Item>
      <Form.Item label="Email автора отзыва" name="authorEmail">
        <Input />
      </Form.Item>
      <Form.Item label="Номер телефона автора" name="authorPhone">
        <Input />
      </Form.Item>
      <Form.Item label="Рейтинг отзыва" name="reviewRating">
        <Input />
      </Form.Item>
      <Form.Item label="Текст отзыва" name="reviewText">
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name={'publicationDatetime'}
        label="Дата и время публикации отзыва"
        getValueProps={(i) => ({
          value: moment(i).format('YYYY-MM-DDTHH:mm')
        })}
      >
        <input type="datetime-local" className="datepicker" />
      </Form.Item>
      <Form.Item
        name={'replyDatetime'}
        label="Дата и время публикации ответа"
        getValueProps={(i) => ({
          value: moment(i).format('YYYY-MM-DDTHH:mm')
        })}
      >
        <input type="datetime-local" className="datepicker" />
      </Form.Item>
      <Form.Item label="Текст ответа" name="replyText">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Внешняя ссылка на отзыв" name="reviewExternalLink">
        <Input />
      </Form.Item>
      <Form.Item label="Платформа на которой опубликован отзыв" name="platform">
        <Select options={redirectPlatforms} />
      </Form.Item>
      <Form.Item label="ID компании" name={['location']}>
        <Select {...locSelectProps} />
      </Form.Item>
    </Form>
  );

  return (
    <>
      {!isEdit && (
        <Create
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Создание отзыва"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Create>
      )}
      {isEdit && (
        <Edit
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Редактирование отзыва"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Edit>
      )}
    </>
  );
};
