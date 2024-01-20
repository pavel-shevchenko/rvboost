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
  message,
  Space
} from 'antd';
import { FileZipOutlined } from '@ant-design/icons';
import { env } from 'next-runtime-env';
import { FieldData } from 'rc-field-form/es/interface';
import 'reflect-metadata';

import { NewClientDto } from 'validation/src/dto/new_client';
import { useFetch } from '@/services/hooks';
import { useUserStore } from '@/services/stores/user';
import { createFieldDataErrorsPopulate } from '@/services/helpers/validation';
import { useState } from 'react';
import { Location } from '@/services/typing/entities';
import { downloadOrganizationQR } from '@/services/helpers/downloadOrganizationQR';

const companiesFieldEmptyItem = {
  companyName: '',
  companyAddress: '',
  companyLinkDefault: '',
  companyLinkGoogle: '',
  companyLinkTrustPilot: ''
};

const initialState = [
  {
    touched: false,
    errors: [],
    name: ['orgName']
  },
  {
    touched: false,
    errors: [],
    name: ['clientEmail']
  },
  {
    touched: false,
    errors: [],
    name: ['clientName']
  },
  {
    touched: false,
    errors: [],
    name: ['clientPassword']
  },
  {
    touched: false,
    errors: [],
    name: ['companies'],
    value: [companiesFieldEmptyItem]
  }
];

function addCompanySubfields(index: number, state: typeof initialState) {
  const newState = [...state];
  for (const subfield of Object.keys(companiesFieldEmptyItem)) {
    newState.push({
      touched: false,
      errors: [],
      // @ts-ignore
      name: ['companies', index, subfield]
    });
  }
  return newState;
}

const populateFdsErrors = createFieldDataErrorsPopulate(NewClientDto);

export default function AddClient() {
  const [formFDs, setFormFDs] = useState<FieldData[]>(
    addCompanySubfields(0, initialState)
  );
  const [form] = Form.useForm<NewClientDto>();
  const [validateOnlyTouched, setValidateOnlyTouched] = useState(true);

  const [createdLocations, setCreatedLocations] = useState<Array<Location>>();
  const authToken = useUserStore((state) => state.authToken);

  const onFieldsChange = (changedFields: FieldData[], allFields: FieldData[]) => {
    const fds = populateFdsErrors(
      form.getFieldsValue(),
      [...allFields],
      validateOnlyTouched
    );
    setFormFDs(fds);
  };

  const addEmptyCompany = () => {
    let companiesPrevCnt: number;
    const newFormFDs = formFDs.map((fd) => {
      if (fd.name?.length === 1 && fd.name[0] === 'companies') {
        companiesPrevCnt = fd.value?.length;
        fd.value?.push(companiesFieldEmptyItem);
      }
      return fd;
    });
    // @ts-ignore
    setFormFDs(addCompanySubfields(companiesPrevCnt, newFormFDs));
  };

  const removeCompany = (index: number | string) =>
    setFormFDs(
      formFDs
        .filter((fd) => fd.name[0] !== 'companies' || fd.name?.[1] !== index)
        .map((fd) => {
          if (fd.name?.length === 1 && fd.name[0] === 'companies')
            fd.value?.splice(index, 1);
          else if (
            fd.name?.length > 1 &&
            fd.name[0] === 'companies' &&
            fd.name?.[1] > index
          )
            fd.name[1]--;

          return fd;
        })
    );

  const onFinish = async (values: NewClientDto) => {
    form.setFields(populateFdsErrors(form.getFieldsValue(), [...formFDs]));
    const errorsCnt = form.getFieldsError().filter((e) => e.errors.length).length;
    setValidateOnlyTouched(false);
    if (errorsCnt || !form.isFieldsTouched()) return;

    const fetch = useFetch(authToken);
    const newLocations = await fetch.post(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/organization/new-client`,
      values
    );

    setCreatedLocations(newLocations);
    message.success('Клиент успешно создан!');
  };

  return (
    <>
      <Typography.Title level={4}>Создание нового клиента</Typography.Title>

      <Card>
        {createdLocations && (
          <Space
            style={{
              width: '100%',
              paddingTop: '12px',
              justifyContent: 'center'
            }}
          >
            <Row gutter={37} align="middle" style={{ width: '300px' }}>
              <Col md={3} xs={24} style={{ height: '50px' }}>
                <FileZipOutlined style={{ fontSize: '28px' }} />
              </Col>
              <Col md={21} xs={24} style={{ marginTop: '-18px' }}>
                <Typography.Link
                  onClick={() => downloadOrganizationQR(createdLocations)}
                >
                  Скачать QR одним архивом
                </Typography.Link>
              </Col>
            </Row>
          </Space>
        )}
        {!createdLocations && (
          <Form
            layout="vertical"
            form={form}
            fields={formFDs}
            {...{ onFieldsChange }}
            {...{ onFinish }}
            scrollToFirstError={true}
          >
            <Form.Item label="Название организации" name="orgName">
              <Input />
            </Form.Item>
            <Form.Item label="Email клиента" name="clientEmail">
              <Input />
            </Form.Item>
            <Form.Item label="Имя клиента" name="clientName">
              <Input />
            </Form.Item>
            <Form.Item label="Его пароль" name="clientPassword">
              <Input />
            </Form.Item>

            <br />
            <Divider orientation="left" orientationMargin="0">
              <Typography.Title level={5} style={{ marginTop: '5px' }}>
                Компании:
              </Typography.Title>
            </Divider>

            <Form.List name={['companies']}>
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key}>
                      <Row gutter={10} align="middle">
                        <Col md={20} xs={24}>
                          <Form.Item
                            {...restField}
                            name={[name, 'companyName']}
                            label="Название компании"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col md={4} xs={24}>
                          <Button
                            style={{ width: '100%', margin: '5px 0 0 -11px' }}
                            type="link"
                            onClick={() => removeCompany(name)}
                          >
                            ⌫&nbsp;Удалить
                          </Button>
                        </Col>
                      </Row>
                      <Form.Item
                        {...restField}
                        name={[name, 'companyAddress']}
                        label="Адрес компании"
                      >
                        <Input />
                      </Form.Item>
                      <Row gutter={10} key={key} align="middle">
                        <Col md={8} xs={24}>
                          <Form.Item
                            {...restField}
                            name={[name, 'companyLinkDefault']}
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
                      onClick={() => addEmptyCompany()}
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
        )}
      </Card>
    </>
  );
}
