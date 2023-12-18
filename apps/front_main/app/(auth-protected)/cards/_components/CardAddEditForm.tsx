'use client';

import { Card, User } from '@/services/typing/entities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Checkbox, Form, Input, Select } from 'antd';
import { RedirectPlatformEnum } from 'typing/src/enums';

const redirectPlatforms = Object.keys(RedirectPlatformEnum).map((platform) => ({
  label: platform,
  value: platform
}));

export const CardAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Card>();

  const { selectProps: locSelectProps } = useSelect<User>({
    resource: 'location',
    optionLabel: 'id'
  });

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="Опция перехвата отзыва"
        name="isReviewInterception"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        label="Выбор платформы на которую будет переадресация"
        name="redirectPlatform"
      >
        <Select options={redirectPlatforms} />
      </Form.Item>
      <Form.Item
        label="Опция переадресации по кастомной ссылке"
        name="isCustomLinkRedirect"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        label="Кастомная ссылка для переадресации пользователем"
        name="linkCustom"
      >
        <Input />
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
          title="Создание новой карточки QR"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Create>
      )}
      {isEdit && (
        <Edit
          breadcrumb={<></>}
          goBack={<>←&nbsp;Назад к списку</>}
          title="Редактирование карточки QR"
          saveButtonProps={saveButtonProps}
        >
          {commonForm}
        </Edit>
      )}
    </>
  );
};
