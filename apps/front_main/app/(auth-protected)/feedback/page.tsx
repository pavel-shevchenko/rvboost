'use client';

import { useContext } from 'react';
import { Alert, Card, Form, Typography } from 'antd';

import { CaslContext } from '@/services/casl/common';
import { PermissionAction, PermissionSubject } from 'casl/src/legacy_typing';

export default function FeedbackPage() {
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

  return <NegativeFeedback />;
}

function NegativeFeedback() {
  return (
    <>
      <Typography.Title level={4}>Управление сбором отзывов</Typography.Title>

      <Card>
        <Form></Form>
      </Card>
    </>
  );
}
