'use client';

import {
  Form,
  Input,
  Button,
  Divider,
  Typography,
  Row,
  Col,
  Card,
  message
} from 'antd';
import { env } from 'next-runtime-env';
import { useRouter } from 'next/navigation';

import { NewClientDto } from 'validation/src/dto/new_client';
import { useFetch } from '@/services/hooks/useFetch';
import { useUserStore } from '@/services/stores/user';
import { Routes } from '@/services/helpers/routes';

export default function AddClient() {
  const router = useRouter();
  const authToken = useUserStore((state) => state.authToken);

  const onFinish = async (values: NewClientDto) => {
    const fetch = useFetch(authToken, false);
    const res = await fetch.post(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/organization/new-client`,
      values
    );
    message.success('Клиент успешно создан!');
    router.push(Routes.companies);
  };

  return (
    <>
      <Typography.Title level={4}>Создание нового клиента</Typography.Title>

      <Card>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Название организации"
            name="orgName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email клиента"
            name="clientEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Имя клиента"
            name="clientName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Его пароль"
            name="clientPassword"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <br />
          <Divider orientation="left" orientationMargin="0">
            <Typography.Title level={5} style={{ marginTop: '5px' }}>
              Компании:
            </Typography.Title>
          </Divider>

          <Form.List
            name={['companies']}
            initialValue={[
              {
                companyName: '',
                companyAddress: '',
                companyLinkDefault: '',
                companyLinkGoogle: '',
                companyLinkTrustPilot: ''
              }
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key}>
                    <Row gutter={10} align="middle">
                      <Col md={20} xs={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'companyName']}
                          rules={[{ required: true }]}
                          label="Название компании"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col md={4} xs={24}>
                        <Button
                          style={{ width: '100%', margin: '5px 0 0 -11px' }}
                          type="link"
                          onClick={() => remove(name)}
                        >
                          ⌫&nbsp;Удалить
                        </Button>
                      </Col>
                    </Row>
                    <Form.Item
                      {...restField}
                      name={[name, 'companyAddress']}
                      rules={[{ required: true }]}
                      label="Адрес компании"
                    >
                      <Input />
                    </Form.Item>
                    <Row gutter={10} key={key} align="middle">
                      <Col md={8} xs={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'companyLinkDefault']}
                          rules={[{ required: true }]}
                          label="Ссылка по умолчанию"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'companyLinkGoogle']}
                          label="Ссылка на Google"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'companyLinkTrustPilot']}
                          label="Ссылка на TrustPilot"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon="+"
                    block
                    size="large"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    Добавить компанию
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Создать нового клиента
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
