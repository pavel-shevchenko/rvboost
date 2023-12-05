'use client';

import { SyntheticEvent, useState } from 'react';
import styled from 'styled-components';

import { breakpoints, colors } from '@/app/_components/root-layout/styles';
import { LoadingOverlay } from '@/app/_components/common';
import { InputWrapper, TextInput } from '@/app/_components/common/forms';
import { AuthButton, AuthCard, AuthFormLabel } from '@/app/auth/_components';
import {
  ForgotPassFormHeader,
  ResetSuccess
} from '@/app/auth/forgot-password/_components';
import { useFetch } from '@/services/hooks/useFetch';
import { message } from 'antd';

const Wrapper = styled.div`
  background-color: ${colors.gray50};
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: ${breakpoints.small}) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  @media (min-width: ${breakpoints.large}) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      email: { value: string };
    };
    const email = target.email.value;

    setIsLoading(true);
    try {
      const fetch = useFetch();
      const res = await fetch.get(
        'http://193.168.46.135/api/auth/reset-password/' + email
      );
      setSuccess(true);
    } catch (errors: any) {
      message.error('Email не найден!');
    }
    setIsLoading(false);
  };

  return (
    <>
      <Wrapper>
        {isLoading && <LoadingOverlay />}
        {!success ? (
          <div>
            <ForgotPassFormHeader />
            <AuthCard>
              <form onSubmit={handleSubmit}>
                <AuthFormLabel htmlFor="email">Email:</AuthFormLabel>
                <InputWrapper>
                  <TextInput type="email" name="email" id="email" />
                </InputWrapper>
                <AuthButton type="submit">Submit</AuthButton>
              </form>
            </AuthCard>
          </div>
        ) : (
          <ResetSuccess />
        )}
      </Wrapper>
    </>
  );
}
