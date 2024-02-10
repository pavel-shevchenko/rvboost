'use client';

import {
  useTable,
  useSimpleList,
  List as RefineList,
  EditButton,
  DeleteButton,
  CreateButton
} from '@refinedev/antd';
import { Card, Alert, List, Col, Row, Typography, Rate } from 'antd';
import { useContext } from 'react';
import moment from 'moment/moment';

import { PermissionAction, PermissionSubject } from 'casl/src/legacy_typing';
import { Review } from '@/services/typing/apiEntities';
import { Can, CaslContext } from '@/services/casl/common';
import {
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  ExportOutlined,
  BankOutlined,
  EnvironmentOutlined,
  CommentOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { capitalize } from '@/services/helpers/misc';

export default function ReviewsPage() {
  const ctxCan = useContext(CaslContext);

  if (ctxCan.cannot('manage', PermissionSubject.entityReview))
    return (
      <Card style={{ height: '100vh' }}>
        <br />
        <Alert
          type="warning"
          message="Только для пользователей с активной подпиской"
        />
      </Card>
    );

  return <ReviewList />;
}

function ReviewList() {
  const { pageCount, listProps } = useSimpleList<Review>({
    pagination: { pageSize: 50 }
  });
  const { tableProps } = useTable<Review>({
    pagination: { pageSize: 50 }
  });

  return (
    <>
      <RefineList
        title="Список отзывов"
        headerButtons={
          <Can do={PermissionAction.create} on={PermissionSubject.entityReview}>
            <CreateButton>Новый отзыв</CreateButton>
          </Can>
        }
      >
        <List
          {...listProps}
          renderItem={(review, index) => (
            <List.Item>
              <Row gutter={10} align="middle" style={{ width: '100%' }}>
                <Col md={6} xs={24} style={{ alignSelf: 'start' }}>
                  <Rate
                    allowHalf
                    disabled
                    defaultValue={parseFloat(review?.reviewRating)}
                    style={{
                      margin: '0 2px 19px 0',
                      position: 'relative',
                      top: '3px'
                    }}
                  />
                  &nbsp;{review?.reviewRating}
                  {review?.platform && (
                    <Typography.Paragraph>
                      {!review?.reviewExternalLink ? (
                        'Платформа:'
                      ) : (
                        <a target="_blank" href={review?.reviewExternalLink}>
                          <ExportOutlined />
                        </a>
                      )}
                      &nbsp;{capitalize(review?.platform)}
                    </Typography.Paragraph>
                  )}
                  {/* @ts-ignore */}
                  {review?.location?.id && (
                    <Typography.Paragraph>
                      {/* @ts-ignore */}
                      ID компании: {review?.location?.id}
                    </Typography.Paragraph>
                  )}
                  {/* @ts-ignore */}
                  {review?.location?.name && (
                    <Typography.Paragraph>
                      <BankOutlined />
                      {/* @ts-ignore */}
                      &nbsp;{review.location?.name}
                    </Typography.Paragraph>
                  )}
                  {/* @ts-ignore */}
                  {review?.location?.address && (
                    <Typography.Paragraph>
                      <EnvironmentOutlined />
                      {/* @ts-ignore */}
                      &nbsp;{review.location?.address}
                    </Typography.Paragraph>
                  )}
                  {review.publicationDatetime && (
                    <Typography.Paragraph>
                      <CalendarOutlined />
                      &nbsp;
                      {moment(review.publicationDatetime).format(
                        'DD.MM.YYYY HH:mm'
                      )}
                    </Typography.Paragraph>
                  )}
                  {review.authorName && (
                    <Typography.Title level={5} style={{ margin: '-2px 0 14px' }}>
                      <UserOutlined />
                      &nbsp;{review.authorName}
                    </Typography.Title>
                  )}
                  {review.authorEmail && (
                    <Typography.Paragraph>
                      <MailOutlined />
                      &nbsp;{review.authorEmail}
                    </Typography.Paragraph>
                  )}
                  {review.authorPhone && (
                    <Typography.Paragraph>
                      <PhoneOutlined />
                      &nbsp;{review.authorPhone}
                    </Typography.Paragraph>
                  )}
                </Col>
                <Col md={16} xs={24} style={{ alignSelf: 'start' }}>
                  {review.reviewText && (
                    <div
                      style={{
                        width: '100%',
                        display: 'flex'
                      }}
                    >
                      <div style={{ paddingRight: '10px' }}>
                        <MessageOutlined />
                      </div>
                      <div>{review.reviewText}</div>
                    </div>
                  )}
                  {review.replyText && (
                    <div
                      style={{
                        padding: '18px 0 0 15px',
                        width: '100%',
                        display: 'flex'
                      }}
                    >
                      <div style={{ paddingRight: '10px' }}>
                        <CommentOutlined />
                      </div>
                      <div>
                        {review.replyDatetime && (
                          <Typography.Paragraph>
                            {moment(review.replyDatetime).format(
                              'DD.MM.YYYY HH:mm'
                            )}
                          </Typography.Paragraph>
                        )}
                        {review.replyText}
                      </div>
                    </div>
                  )}
                </Col>
                <Col md={2} xs={24}>
                  <div style={{ width: '55px' }}>
                    <EditButton
                      style={{ float: 'left' }}
                      hideText
                      size="small"
                      recordItemId={review.id}
                    />
                    <Can
                      do={PermissionAction.delete}
                      on={PermissionSubject.entityReview}
                    >
                      <DeleteButton
                        style={{ float: 'right' }}
                        hideText
                        size="small"
                        recordItemId={review.id}
                      />
                    </Can>
                  </div>
                </Col>
              </Row>
            </List.Item>
          )}
        ></List>
      </RefineList>
    </>
  );
}
