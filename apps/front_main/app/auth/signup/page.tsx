'use client';

import { useState } from 'react';
import { Formik } from 'formik';

import { LoadingOverlay } from '@/app/_components/common';
import { FormErrorText } from '@/app/_components/common/forms';
import { InputWrapper, TextInput } from '@/app/_components/common/forms';
import { AuthButton, AuthCard, AuthFormLabel } from '@/app/auth/_components';
import { LocalRegistrationDto } from 'validation/src/dto/local_registration';
import { SignupFormHeader } from '@/app/auth/signup/_components';
import { useUserStore } from '@/services/stores/user';
import { useRouter } from 'next/navigation';
import { Routes } from '@/services/helpers/routes';
import { createFormikValidator } from '@/services/helpers/validation';

const registerValidate = createFormikValidator(LocalRegistrationDto, {
  validator: {
    skipMissingProperties: true
  }
});

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const register = useUserStore((state) => state.register);
  const router = useRouter();

  const registerSubmit = async (
    dto: LocalRegistrationDto,
    { setErrors }: { setErrors: (errors: { [key: string]: string }) => void }
  ) => {
    setIsLoading(true);
    try {
      await register(dto);
      router.push(Routes.dashboard);
    } catch (errors: any) {
      setErrors(errors);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <SignupFormHeader />

      <AuthCard>
        <Formik
          initialValues={{ email: '', password: '', username: '' }}
          onSubmit={registerSubmit}
          validate={registerValidate}
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
                  name="email"
                  id="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  data-test-id="email"
                />
              </InputWrapper>
              {errors.email && touched.email && (
                <FormErrorText>{errors.email}</FormErrorText>
              )}
              <AuthFormLabel htmlFor="username">
                First and Last Name:
              </AuthFormLabel>
              <InputWrapper>
                <TextInput
                  type="text"
                  name="username"
                  id="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  data-test-id="username"
                />
              </InputWrapper>
              {errors.username && touched.username && (
                <FormErrorText>{errors.username}</FormErrorText>
              )}
              <AuthFormLabel htmlFor="password">Password:</AuthFormLabel>
              <InputWrapper>
                <TextInput
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  data-test-id="password"
                />
              </InputWrapper>
              {errors.password && touched.password && (
                <FormErrorText>{errors.password}</FormErrorText>
              )}
              <AuthButton type="submit">SignUp</AuthButton>
            </form>
          )}
        </Formik>

        {/*
          <ContinueWith />
          <GoogleButton GoogleSignin={GoogleSignin} />
          */}
      </AuthCard>
    </>
  );
}
