'use client';

import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Radio,
  Switch,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Upload,
  UploadProps,
  message,
  Select
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import { Can, CaslContext } from '@/services/casl/common';
import { PermissionAction, PermissionSubject } from 'casl/src/legacy_typing';
import { RedirectPlatformEnum } from 'typing/src/enums';
import { env } from 'next-runtime-env';
import { useUserStore } from '@/services/stores/user';
import { useFetch } from '@/services/hooks';
import { useSelect } from '@refinedev/antd';
import { Organization } from '@/services/typing/apiEntities';
import { useRouter } from 'next/navigation';
import { Routes } from '@/services/helpers/routes';

const redirectPlatforms = Object.keys(RedirectPlatformEnum).map((platform) => ({
  label: platform,
  value: platform
}));

const logoSizeLimitMb = 10;

const isLogoValid = (info: UploadChangeParam<UploadFile>) => {
  const isSizeAccept = (info.file.size as number) / 1024 / 1024 < logoSizeLimitMb;
  if (!isSizeAccept && info.file.size) {
    message.error(`Логотип должен быть не более ${logoSizeLimitMb} мегабайт!`);
    return false;
  }
  return true;
};

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

export default function FeedbackAddEditForm({
  id,
  isAddNew
}: {
  id?: string;
  isAddNew?: boolean;
}) {
  const router = useRouter();
  const ctxCan = useContext(CaslContext);

  if (
    ctxCan.cannot(
      PermissionAction.negativeFbManage,
      PermissionSubject.entityReview
    )
  )
    return (
      <Card style={{ height: '100vh' }}>
        <br />
        <Alert
          type="warning"
          message="Только для пользователей с активной подпиской"
        />
      </Card>
    );

  const [formValues, setFormValues] = useState();
  const authToken = useUserStore((state) => state.authToken);
  const fetch = useFetch(authToken);

  const [logoUploadProps, setLogoUploadProps] = useState<UploadProps>({
    action: '',
    maxCount: 1,
    multiple: false,
    accept: 'image/*',
    listType: 'picture',
    beforeUpload: () => {
      return false;
    },
    onChange: (info) => {
      if (!isLogoValid(info)) return false;
      setLogoUploadProps({
        ...logoUploadProps,
        fileList:
          info.file.status === 'removed'
            ? []
            : [
                {
                  uid: '1',
                  name: info.file.name,
                  status: 'done',
                  // @ts-ignore
                  url: URL.createObjectURL(info.file)
                }
              ],
        listType: info.file.status === 'removed' ? undefined : 'picture',
        showUploadList: info.file.status !== 'removed'
      });
    }
  });

  useEffect(() => {
    const init = async () => {
      if (!authToken || isAddNew) return;

      const initValues = await fetch.get(
        `${env('NEXT_PUBLIC_SERVER_URL')}/api/review/feedback-settings${
          !id ? '' : '/' + id
        }`
      );

      if (initValues) {
        if (initValues?.redirectPlatform?.length)
          initValues.redirectPlatform = initValues.redirectPlatform.pop();
        if (initValues?.ratingThreshold)
          initValues.ratingThreshold = initValues.ratingThreshold / 2;
        setFormValues(initValues);
      }
      // @ts-ignore
      else setFormValues({ formInitializedMarker: true });
      if (!initValues?.logoS3Key) return;

      const logo = await fetch.get(
        `${env(
          'NEXT_PUBLIC_SERVER_URL'
        )}/api/review/logo-by-s3key/${initValues?.logoS3Key}`
      );

      if (logo.body instanceof ReadableStream) {
        const logoDataUrl = URL.createObjectURL(
          new Blob([(await logo.body.getReader().read()).value])
        );
        setLogoUploadProps({
          ...logoUploadProps,
          fileList: [
            {
              uid: '1',
              name: 'Ранее загруженный логотип',
              status: 'done',
              url: logoDataUrl
            }
          ]
        });
      }
    };
    init();
  }, [authToken]);

  const onFinish = async (values: any) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (key === 'logo' || key === 'organization') continue;
      if (Array.isArray(value))
        value.map((item) => formData.append(key + '[]', item));
      else if (key === 'ratingThreshold')
        formData.append(key, String(parseFloat(value as string) * 2));
      else if (key === 'redirectPlatform')
        formData.append(key + '[]', String(value));
      else if (value) formData.append(key, value as string);
    }
    if (values.logo) {
      if (!isLogoValid(values.logo as UploadChangeParam)) return;

      const file = values.logo.file as File;
      // @ts-ignore
      if (file.status !== 'removed') formData.append('logo', file);
      else formData.append('logo', 'removed');
    }

    try {
      const res = await fetch.post(
        `${env('NEXT_PUBLIC_SERVER_URL')}/api/review/feedback-settings${
          !values?.organization ? '' : '/' + values.organization
        }${!id ? '' : '/' + id}`,
        formData
      );
      message.success('Настройки успешно сохранены!');

      if (isAddNew) router.push(Routes.feedbackSettings);
    } catch (e) {
      message.error(Object.values(e as []).join('; '));
    }
  };

  if (!formValues && !isAddNew) return <></>;
  return (
    <>
      <Typography.Title level={4}>Управление сбором отзывов</Typography.Title>

      <Card>
        <Form onFinish={onFinish} initialValues={formValues}>
          <Can do="manage" on={PermissionSubject.entityFbSettings}>
            <OrganizationSelect />
          </Can>
          <Form.Item
            label="Заголовок вопроса"
            name="questionTitle"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Текст разъясняющий вопрос"
            name="questionDescr"
            labelCol={{ span: 24 }}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="logo"
            label="Загрузить лого"
            extra={`Изображение не более ${logoSizeLimitMb}Мб`}
            valuePropName="file"
          >
            <Upload {...logoUploadProps}>
              <Button icon={<UploadOutlined />}>Загрузить лого</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Порог оценки"
            name="ratingThreshold"
            rules={[{ required: true }]}
            extra="От 1 до 5, разделитель дроби - точка"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Куда ведёт редирект"
            name="redirectPlatform"
            labelCol={{ span: 24 }}
          >
            <Radio.Group options={redirectPlatforms} />
          </Form.Item>
          <Form.Item
            label="Текст с просьбой оставить отзыв на внешнем ресурсе"
            name="externalResourceAskingText"
            labelCol={{ span: 24 }}
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Текст для запроса плохого отзыва"
            name="badReviewRequestText"
            labelCol={{ span: 24 }}
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Текст после сабмита плохого отзыва"
            name="badReviewOnSubmitText"
            labelCol={{ span: 24 }}
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Row gutter={10} align="middle">
            <Col md={15} xs={24}>
              <Form.Item
                label="Запрашивать имя пользователя"
                name="whetherRequestUsername"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col md={9} xs={24}>
              <Form.Item
                label="Обязательно"
                name="requestUsernameRequired"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10} align="middle">
            <Col md={15} xs={24}>
              <Form.Item
                label="Запрашивать телефон пользователя"
                name="whetherRequestPhone"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col md={9} xs={24}>
              <Form.Item
                label="Обязательно"
                name="requestPhoneRequired"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10} align="middle">
            <Col md={15} xs={24}>
              <Form.Item
                label="Запрашивать E-mail пользователя"
                name="whetherRequestEmail"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col md={9} xs={24}>
              <Form.Item
                label="Обязательно"
                name="requestEmailRequired"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <br />
          <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
