'use client';

import { downloadZip, InputWithoutMeta } from 'client-zip';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Button, Form, Input, Select } from 'antd';
import { Organization, User } from '@/services/typing/entities';
import { getQrImageLink } from 'business/src/index';

export const OrgAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Organization>();

  const { selectProps: userSelectProps } = useSelect<User>({
    resource: 'user',
    optionLabel: 'id' // 'email'
  });

  const downloadQR = async () => {
    const files: Array<InputWithoutMeta> = [];
    for (const location of queryResult?.data?.data?.locations) {
      if (!location?.card.shortLinkCode) continue;
      files.push({
        name: location.name + '.png',
        // @ts-ignore
        input: (await fetch(getQrImageLink(location?.card.shortLinkCode))).body
      });
    }
    // get the ZIP stream in a Blob
    const blob = await downloadZip(files).blob();
    // make and click a temporary link to download the Blob
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'QR.zip';
    link.click();
    // don't forget to revoke Blob URL
    URL.revokeObjectURL(link.href);
    link.remove();
  };

  const commonForm = (
    <Form {...formProps} layout="vertical">
      <Form.Item label="Название" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="ID клиента"
        name={['user', 'id']}
        rules={[{ required: true }]}
      >
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
          headerButtons={
            <Button onClick={downloadQR}>Скачать QR-коды zip-архивом</Button>
          }
        >
          {commonForm}
        </Edit>
      )}
    </>
  );
};
