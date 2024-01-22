'use client';

import { Form, Input, Space, Typography, Rate, Button } from 'antd';
import { useState } from 'react';

import { ReviewInterceptionHydration } from '@/services/typing';
import { useFetch } from '@/services/hooks';
import { env } from 'next-runtime-env';
import { RedirectPlatformEnum } from 'typing/src/enums/redirect-platform.enum';
import { ExportOutlined } from '@ant-design/icons';

export default function ClientSideForm({
  data
}: {
  data: ReviewInterceptionHydration;
}) {
  const fetch = useFetch();
  const [screen, setScreen] = useState(1);
  const [reviewId, setReviewId] = useState(0);

  const submitEvaluation = async (values: any) => {
    values.location = data.locationId;
    values.reviewRating = String(values.reviewRating * 2);
    values.publicationDatetime = new Date();

    const newReview = await fetch.post(
      `${env(
        'NEXT_PUBLIC_SERVER_URL'
      )}/api/review/new-review-interception-evaluation`,
      values
    );
    if (!newReview?.id) throw new Error('Не удалось отправить оценку!');

    setReviewId(newReview.id);
    if (+values.reviewRating >= +data.ratingThreshold) setScreen(2);
    else setScreen(3);
  };

  const submitBadReview = (values: any) => {
    values.publicationDatetime = new Date();

    fetch.put(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/review/put-review-interception/${
        data.shortLinkCode
      }/${reviewId}`,
      values
    );
    setScreen(4);
  };

  return (
    <>
      <Space style={{ height: '50px' }}>&nbsp;</Space>
      {data.logo && (
        <Space
          style={{
            width: '100%',
            paddingBottom: '20px',
            justifyContent: 'center'
          }}
        >
          <img width={50} src={data.logo} />
        </Space>
      )}

      {screen === 1 && (
        <Form onFinish={submitEvaluation}>
          {data.whetherRequestUsername && (
            <Form.Item
              name="authorName"
              rules={[
                data.requestUsernameRequired
                  ? {
                      required: true,
                      message: 'Обязательное поле для заполнения'
                    }
                  : {}
              ]}
            >
              <Input placeholder="Как вас зовут?" />
            </Form.Item>
          )}
          {data.whetherRequestEmail && (
            <Form.Item
              name="authorEmail"
              rules={[
                data.requestEmailRequired
                  ? {
                      required: true,
                      message: 'Обязательное поле для заполнения'
                    }
                  : {}
              ]}
            >
              <Input type="email" placeholder="Ваш email" />
            </Form.Item>
          )}
          {data.whetherRequestPhone && (
            <Form.Item
              name="authorPhone"
              rules={[
                data.requestPhoneRequired
                  ? {
                      required: true,
                      message: 'Обязательное поле для заполнения'
                    }
                  : {}
              ]}
            >
              <Input placeholder="Ваш номер телефона" />
            </Form.Item>
          )}
          {data.questionTitle && (
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <b>{data.questionTitle}</b>
            </Typography.Paragraph>
          )}
          {data.questionDescr && (
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              {data.questionDescr}
            </Typography.Paragraph>
          )}
          <Space
            style={{
              width: '100%',
              paddingBottom: '7px',
              justifyContent: 'center'
            }}
          >
            <Form.Item
              name="reviewRating"
              initialValue={null}
              rules={[{ required: true, message: 'Сделайте оценку' }]}
            >
              <Rate allowHalf />
            </Form.Item>
          </Space>
          <Form.Item
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '80px'
            }}
          >
            <Button type="primary" htmlType="submit">
              Отправить оценку
            </Button>
          </Form.Item>
        </Form>
      )}

      {screen === 2 && (
        <>
          {data.externalResourceAskingText && (
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <b>{data.externalResourceAskingText}</b>
            </Typography.Paragraph>
          )}
          {data.redirectPlatform.includes(RedirectPlatformEnum.default) && (
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <Button
                type="link"
                href={data.linkDefault}
                icon={<ExportOutlined />}
              >
                Default
              </Button>
            </Typography.Paragraph>
          )}
          {data.redirectPlatform.includes(RedirectPlatformEnum.google) && (
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <Button
                type="link"
                href={data.linkGoogle}
                icon={<ExportOutlined />}
              >
                Google
              </Button>
            </Typography.Paragraph>
          )}
          {data.redirectPlatform.includes(RedirectPlatformEnum.trustpilot) && (
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <Button
                type="link"
                href={data.linkTrustPilot}
                icon={<ExportOutlined />}
              >
                TrustPilot
              </Button>
            </Typography.Paragraph>
          )}
        </>
      )}

      {screen === 3 && (
        <Form onFinish={submitBadReview}>
          {data.badReviewRequestText && (
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <b>{data.badReviewRequestText}</b>
            </Typography.Paragraph>
          )}
          <Form.Item
            name="reviewText"
            rules={[
              {
                required: true,
                message: 'Обязательное поле для заполнения'
              }
            ]}
          >
            <Input.TextArea placeholder="Комментарий" />
          </Form.Item>
          <Form.Item
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '80px'
            }}
          >
            <Button type="primary" htmlType="submit">
              Отправить отзыв
            </Button>
          </Form.Item>
        </Form>
      )}

      {screen === 4 && (
        <>
          {data.badReviewOnSubmitText && (
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <b>{data.badReviewOnSubmitText}</b>
            </Typography.Paragraph>
          )}
          {!data.badReviewOnSubmitText && (
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <b>Спасибо большое, что оставили отзыв!</b>
            </Typography.Paragraph>
          )}
        </>
      )}
    </>
  );
}
