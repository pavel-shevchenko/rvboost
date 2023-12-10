'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { message, Spin } from 'antd';
import { env } from 'next-runtime-env';

import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import { LoadingOverlay } from '@/app/_components/common';
import { FieldLabel, TextInput } from '@/app/_components/common/forms';
import { AuthButton, AuthCard, AuthTitle } from '@/app/auth/_components';
import { Routes } from '@/services/helpers/routes';
import { useFetch } from '@/services/hooks/useFetch';
import { useSearchParams } from 'next/navigation';

const Wrapper = styled.div`
  background-color: ${colors.gray50};
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: ${breakpoints.small}) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  @media (min-width: ${breakpoints.large}) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

const Title = styled(AuthTitle)`
  margin-bottom: 1rem;
`;

const TextWrapper = styled.div`
  text-align: center;
  font-size: 1.075rem;
`;

const CardText = styled.div`
  font-size: 1.075rem;
  font-weight: 500;
  padding-top: 1.5rem;
`;

const SuccessResponse = styled.div`
  font-size: 0.9rem;
  color: green;
  font-weight: 100;
  margin-bottom: 1rem;
  margin-top: -3rem;
`;

export default function PasswordRestore() {
  const params = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState();
  const [token, setToken] = useState();
  const [isLoading, setLoading] = useState(false);

  /* eslint-disable */
  useEffect(() => {
    // @ts-ignore
    setEmail(params.get('email'));
    // @ts-ignore
    setToken(params.get('token'));
  }, []);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      newPassword: { value: string };
    };

    const newPassword = target.newPassword.value;
    if (newPassword.length < 7) {
      alert('Пароль должен быть не менее 7 символов');
      return;
    }

    setLoading(true);
    let data = {
      email,
      token,
      newPassword
    };
    try {
      const fetch = useFetch();
      await fetch.post(
        `${env('NEXT_PUBLIC_SERVER_URL')}/api/auth/restore-password`,
        data
      );
      message.success('Пароль успешно изменён');
      setSuccessMessage('Пароль успешно изменён');
      location.href = Routes.login;
    } catch (errors: any) {
      message.error('Пароль должен быть не менее 7 и не более 20 символов!');
    }
    setLoading(false);
  };

  const seoData = {
    title: 'Saas Starter Kit Pro Reset Password',
    description: 'Saas Starter Kit Pro Reset Password Page'
  };

  return (
    <Wrapper>
      {isLoading && <LoadingOverlay />}
      <Title>Введите новый пароль</Title>
      <Spin
        tip="Пожалуйста, подождите, пока мы настроим вашу учетную запись..."
        spinning={isLoading}
      >
        <AuthCard>
          <SuccessResponse>{successMessage}</SuccessResponse>
          {!successMessage && (
            <div>
              <form onSubmit={handleSubmit}>
                <FieldLabel htmlFor="newPassword">
                  Новый пароль (от 7 символов):
                  <TextInput id="newPassword" name="newPassword" />
                </FieldLabel>
                <AuthButton type="submit">Сохранить</AuthButton>
              </form>
            </div>
          )}
        </AuthCard>
      </Spin>
    </Wrapper>
  );
}
