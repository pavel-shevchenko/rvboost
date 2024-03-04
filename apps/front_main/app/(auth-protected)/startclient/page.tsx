'use client';

import { env } from 'next-runtime-env';
import { Button, Card, Col, Form, Input, message, Row, Typography } from 'antd';

import { useUserStore } from '@/services/stores/user';
import { useFetch } from '@/services/hooks';
import { Routes } from '@/services/helpers/routes';

export default function StartClient() {
  const authToken = useUserStore((state) => state.authToken);
  const promoRegedCode = useUserStore((state) => state.promoRegedCode);

  const onFinish = async (values: { [key: string]: string }) => {
    const fetch = useFetch(authToken);
    const data = {
      orgName: values.orgName,
      promoRegedCountry: values.promoRegedCountry || '',
      promoRegedCity: values.promoRegedCity || '',
      promoRegedAddress: values.promoRegedAddress || '',
      promoRegedZip: values.promoRegedZip || '',
      promoRegedName: values.promoRegedName || '',
      promoRegedSurname: values.promoRegedSurname || '',
      promoRegedPhone: values.promoRegedPhone || '',
      companies: [
        {
          companyAddress: values.companyAddress,
          companyLinkDefault: values.companyLinkDefault,
          companyLinkGoogle: values.companyLinkGoogle,
          companyLinkTrustPilot: values.companyLinkTrustPilot
        }
      ]
    };

    const newLocations = await fetch.post(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/organization/start-client`,
      data
    );

    message.success('Компания и QR-код успешно созданы!');
    window.location.href = Routes.dashboard;
  };

  return authToken ? (
    <>
      <Typography.Title level={4}>Создание клиента</Typography.Title>

      <Card>
        <Form layout="vertical" {...{ onFinish }} scrollToFirstError={true}>
          {promoRegedCode && (
            <>
              <Typography.Title level={5} style={{ marginBottom: '15px' }}>
                Информация по доставке карты:
              </Typography.Title>
              <Form.Item label="Страна доставки" name="promoRegedCountry">
                <Input />
              </Form.Item>
              <Form.Item label="Город" name="promoRegedCity">
                <Input />
              </Form.Item>
              <Form.Item label="Адрес" name="promoRegedAddress">
                <Input />
              </Form.Item>
              <Form.Item label="Почтовый индекс" name="promoRegedZip">
                <Input />
              </Form.Item>
              <Form.Item label="Имя получателя" name="promoRegedName">
                <Input />
              </Form.Item>
              <Form.Item label="Фамилия получателя" name="promoRegedSurname">
                <Input />
              </Form.Item>
              <Form.Item label="Номер телефона получателя" name="promoRegedPhone">
                <Input />
              </Form.Item>
              <br />
              <Typography.Title level={5} style={{ marginBottom: '15px' }}>
                Информация о компании:
              </Typography.Title>
            </>
          )}
          <Form.Item label="Название организации" name="orgName">
            <Input />
          </Form.Item>
          <Form.Item label="Адрес компании" name="companyAddress">
            <Input />
          </Form.Item>
          <Row gutter={10} align="middle">
            <Col md={8} xs={24}>
              <Form.Item name="companyLinkDefault" label="Ссылка по умолчанию">
                <Input />
              </Form.Item>
            </Col>
            <Col md={8} xs={24}>
              <Form.Item name="companyLinkGoogle" label="Ссылка на Google">
                <Input />
              </Form.Item>
            </Col>
            <Col md={8} xs={24}>
              <Form.Item
                name="companyLinkTrustPilot"
                label="Ссылка на TrustPilot"
              >
                <Input />
              </Form.Item>
            </Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Сохранить
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  ) : (
    <></>
  );
}
