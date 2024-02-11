'use client';

import { Location, Organization } from '@/services/typing/apiEntities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import { Col, Form, Input, Row, Select, Typography } from 'antd';

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
      <style>
        {
          'table.stats th, td { padding: 8px; } table.stats td { border-top: 1px solid lightgray}'
        }
      </style>
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
        <Row gutter={20} align="top">
          <Col md={12} xs={24}>
            <Edit
              breadcrumb={<></>}
              goBack={<>←&nbsp;Назад</>}
              title="Редактирование компании"
              saveButtonProps={saveButtonProps}
              headerButtons={<></>}
            >
              {commonForm}
            </Edit>
          </Col>
          <Col md={12} xs={24}>
            <Typography.Title level={5} style={{ margin: '73px 8px 10px' }}>
              Аналитика за последние 30 дней:
            </Typography.Title>
            <table className="stats">
              <tr>
                <th style={{ textAlign: 'left' }}>Action</th>
                <th style={{ textAlign: 'left', width: '70px' }}>Count</th>
              </tr>
              <tr>
                <td>Переход на внешний ресурс</td>
                <td>
                  {/* @ts-ignore */}
                  {queryResult?.data?.data?.externalFollowEventsCntLast30days}
                </td>
              </tr>
              <tr>
                <td>Отображение формы сбора отзыва с экраном оценки</td>
                <td>
                  {/* @ts-ignore */}
                  {queryResult?.data?.data?.showRatingFormEventsCntLast30days}
                </td>
              </tr>
              <tr>
                <td>Отображение формы сбора отзыва с экраном выбора платформы</td>
                <td>
                  {/* @ts-ignore */}
                  {queryResult?.data?.data?.showPlatformFormEventsCntLast30days}
                </td>
              </tr>
              <tr>
                <td>Отображение формы сбора негативного отзыва</td>
                {/* @ts-ignore */}
                <td>{queryResult?.data?.data?.showBadFormEventsCntLast30days}</td>
              </tr>
              <tr>
                <td>Сабмит формы сбора негативного отзыва</td>
                <td>
                  {/* @ts-ignore */}
                  {queryResult?.data?.data?.submitBadFormEventsCntLast30days}
                </td>
              </tr>
              <tr>
                <td>Количество отзывов</td>
                {/* @ts-ignore */}
                <td>{queryResult?.data?.data?.reviewsCountLast30days}</td>
              </tr>
            </table>
          </Col>
        </Row>
      )}
    </>
  );
};
