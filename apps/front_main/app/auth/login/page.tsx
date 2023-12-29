'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

import { colors } from '@/app/_components/root-layout/styles';
import { LoadingOverlay } from '@/app/_components/common';
import { FormErrorText } from '@/app/_components/common/forms';
import { InputWrapper, TextInput } from '@/app/_components/common/forms';
import { AuthButton, AuthCard, AuthFormLabel } from '@/app/auth/_components';
import { LoginFormHeader } from '@/app/auth/login/_components';
import { LocalLoginDto } from 'validation/src/dto/local_login';
import { useUserStore } from '@/services/stores/user';
import { Routes } from '@/services/helpers/routes';
import { createFormikValidator } from '@/services/helpers/validation';

const loginValidate = createFormikValidator(LocalLoginDto);

const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
`;

const ForgotPassword = styled.div`
  text-decoration: underline;
  color: blue;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
`;

const RememberMeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const RememberMeLabel = styled.label`
  margin-left: 0.1rem;
  font-size: 0.925rem;
  color: ${colors.coolGray900};
`;

const StyledLink = styled.a`
  color: ${colors.royalBlue};
`;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const login = useUserStore((state) => state.login);
  const router = useRouter();

  const loginSubmit = async (
    dto: LocalLoginDto,
    { setErrors }: { setErrors: (errors: { [key: string]: string }) => void }
  ) => {
    setIsLoading(true);
    try {
      await login(dto);
      router.push(Routes.dashboard);
    } catch (errors: any) {
      setErrors(errors);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <LoginFormHeader />

      <AuthCard>
        <Formik
          initialValues={{ login_or_email: '', password: '' }}
          onSubmit={loginSubmit}
          validate={loginValidate}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit
          }) => (
            <form onSubmit={handleSubmit}>
              <AuthFormLabel htmlFor="email">Email:</AuthFormLabel>
              <InputWrapper>
                <TextInput
                  type="email"
                  name="login_or_email"
                  id="login_or_email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.login_or_email}
                />
              </InputWrapper>
              {errors.login_or_email && touched.login_or_email && (
                <FormErrorText>{errors.login_or_email}</FormErrorText>
              )}
              <AuthFormLabel htmlFor="password">Пароль:</AuthFormLabel>
              <InputWrapper>
                <TextInput
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
              </InputWrapper>
              {errors.password && touched.password && (
                <FormErrorText>{errors.password}</FormErrorText>
              )}

              <AuthButton type="submit">Войти</AuthButton>
            </form>
          )}
        </Formik>
        <ForgotPasswordWrapper>
          <RememberMeWrapper>
            <input id="remember_me" name="remember_me" type="checkbox" />
            <RememberMeLabel htmlFor="remember_me">
              Запомнить меня
            </RememberMeLabel>
          </RememberMeWrapper>

          <ForgotPassword>
            <Link href={Routes.forgotPassword} passHref legacyBehavior>
              <StyledLink>Забыли пароль?</StyledLink>
            </Link>
          </ForgotPassword>
        </ForgotPasswordWrapper>

        {/*
          <ContinueWith />
          <GoogleButton GoogleSignin={GoogleSignin} />
          */}
      </AuthCard>
    </>
  );
}
