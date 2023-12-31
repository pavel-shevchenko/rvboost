'use client';

import { Location, Organization } from '@/services/typing/entities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Form, Input, Select } from 'antd';

import { PermissionAction, PermissionSubject } from 'casl/src/legacy_typing';
import { Can } from '@/services/casl/common';

function OrganizationSelect() {
  const { selectProps: orgSelectProps } = useSelect<Organization>({
    resource: 'organization',
    optionLabel: 'id'
  });

  return (
    <Form.Item
      label="ID организации"
      name={['organization']}
      rules={[{ required: true }]}
    >
      <Select {...orgSelectProps} />
    </Form.Item>
  );
}

export const LocAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Location>();

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Название" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Адрес" name="address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Ссылка на Google" name="linkGoogle">
        <Input />
      </Form.Item>
      <Form.Item label="Ссылка на TrustPilot" name="linkTrustPilot">
        <Input />
      </Form.Item>
      <Form.Item
        label="Default Ссылка"
        name="linkDefault"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Can do={PermissionAction.read} on={PermissionSubject.entityOrganization}>
        <OrganizationSelect />
      </Can>
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
