'use client';

import { Card, Location } from '@/services/typing/apiEntities';
import { useForm, Edit, Create, useSelect } from '@refinedev/antd';
import {
  Typography,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Button,
  message,
  Tooltip
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { CopyOutlined } from '@ant-design/icons';

import { PermissionAction, PermissionSubject } from 'casl/src/legacy_typing';
import { RedirectPlatformEnum } from 'typing/src/enums';
import { CaslContext } from '@/services/casl/common';
import { getQrImageLink, getShortLink } from 'business/src/index';

const redirectPlatforms = Object.keys(RedirectPlatformEnum)
  .filter((platform) => platform !== RedirectPlatformEnum.default)
  .map((platform) => ({
    label: platform,
    value: platform
  }));

export const CardAddEditForm = ({ isEdit }: { isEdit: boolean }) => {
  const ctxCan = useContext(CaslContext);
  const { formProps, saveButtonProps, queryResult } = useForm<Card>();
  const [qrImageLink, setQrImageLink] = useState('');
  const [qrLink, setQrLink] = useState('');

  const { selectProps: locSelectProps } = useSelect<Location>({
    resource: 'location',
    optionLabel: 'nameDashAddress'
  });

  useEffect(() => {
    if (queryResult?.data?.data?.shortLinkCode) {
      setQrImageLink(getQrImageLink(queryResult?.data?.data?.shortLinkCode));
      setQrLink(getShortLink(queryResult?.data?.data?.shortLinkCode));
    }
  }, [queryResult?.data?.data?.shortLinkCode]);

  const commonForm = (
    <Form {...formProps} layout="vertical">
      {ctxCan.can(
        PermissionAction.reviewInterception,
        PermissionSubject.entityReview
      ) ? (
        <Form.Item
          label="Опция перехвата отзыва"
          name="isReviewInterception"
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
      ) : (
        <Form.Item label="Опция перехвата отзыва" valuePropName="checked">
          <Checkbox disabled checked={false} />
        </Form.Item>
      )}
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
      <Form.Item
        label="ID компании"
        name={['location']}
        rules={[{ required: true }]}
      >
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
          <Row gutter={20} align="top">
            <Col md={17} xs={24}>
              {commonForm}
            </Col>
            {qrImageLink && (
              <Col md={7} xs={24}>
                <img src={qrImageLink} width="100%" />
                <Space
                  style={{
                    margin: '10px 0',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <Typography.Link href={qrImageLink}>
                    Скачать изображение
                  </Typography.Link>
                </Space>
                <Row gutter={5} align="top">
                  <Col md={20} xs={24}>
                    <Input value={qrLink} disabled />
                  </Col>
                  <Col md={4} xs={24}>
                    <Tooltip title="Скопировать в буфер обмена">
                      <Button
                        icon={<CopyOutlined />}
                        size="middle"
                        onClick={() => {
                          navigator.clipboard.writeText(qrLink);
                          message.success('Ссылка скопирована в буфер обмена');
                        }}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Edit>
      )}
    </>
  );
};
