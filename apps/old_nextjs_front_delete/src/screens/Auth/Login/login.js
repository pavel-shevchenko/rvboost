import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AuthContext from '../../../utils/authContext';
import ApiContext from '../../../utils/apiContext';
import { LoginAuth } from '../helpers';
import { colors } from '../../../styles/theme';

import SEO from '../../../components/Marketing/Layout/seo';
import ErrorText from '../../../components/Common/errorText';
import InputWrapper from '../../../components/Common/forms/TextInputWrapper';
import Button from '../../../components/Auth/Buttons/authButton';
import Label from '../../../components/Auth/authFormLabel';
import Input from '../../../components/Common/forms/TextInput';
import ContinueWith from '../../../components/Auth/continueWith';
import GoogleButton from '../../../components/Auth/Buttons/googleButton';
import LoadingOverlay from '../../../components/Common/loadingOverlay';
import LoginFormHeader from './loginFormHeader';
import AuthCard from '../../../components/Auth/authCard';
import axios from '../../../services/axios';
import jwt_decode from 'jwt-decode';

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

const Login = () => {
  const location = useRouter();
  const { firebase, LogIn } = useContext(AuthContext);
  const { fetchFailure, fetchInit, fetchSuccess, apiState } =
    useContext(ApiContext);
  const { isLoading } = apiState;
  const [invite_key, setInviteKey] = useState();
  const [isInviteFlow, setInviteFlow] = useState();

  /* eslint-disable */
  //extract data from query params
  useEffect(() => {
    if (!location.isReady) return;
    setInviteFlow(location.query.isInviteFlow);
    setInviteKey(location.query.verify_key);
  }, [location.isReady]);

  useEffect(() => {
    return () => fetchSuccess();
  }, []);

  /* eslint-enable */

  const handleSubmit = async (
    values,
    { props, resetForm, setErrors, setSubmitting }
  ) => {
    fetchInit();

    // TODO: Use `login_or_email` on request
    let email = values.email;
    let password = values.password;

    // Comment old functionality at the end of the method
    /*
    let authRes = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        fetchFailure(error);
      });

    LoginAuth(
      authRes,
      LogIn,
      firebase,
      fetchFailure,
      isInviteFlow,
      invite_key,
      location
    );
    */
    // New functionality at the end of the method
    const authData = { login_or_email: email, password };
    const res = await axios
      .post(`/api/auth/local-login`, authData)
      .catch((err) => {
        const errors = err?.response?.data;
        if (
          !errors ||
          typeof errors !== 'object' ||
          !Object.keys(errors).length
        ) {
          fetchFailure(err);
        } else {
          setErrors(errors);
          fetchSuccess();
        }
      });
    const jwt_token = res?.data?.access_token;
    const curUser = res?.data?.user;
    if (!jwt_token) return;

    try {
      const jwt_data = jwt_decode(jwt_token);
      console.log('jwt_data', jwt_data);
    } catch {
      console.log('JWT token decode failed');
      let error = {
        type: 'Authentication Failed',
        message: 'Authentication Failed, please try again or contact Support'
      };

      fetchFailure(error);
    }

    // Save user data to global state
    let user = {
      id: curUser.id,
      email,
      username: curUser.username,
      // photo,
      // provider,
      jwt_token
    };
    await LogIn(user);
    location.push(`/user/dashboard`);
  };

  //Google OAuth2 Signin
  const GoogleSignin = async () => {
    fetchInit();
    let provider = new firebase.auth.GoogleAuthProvider();

    let authRes = await firebase
      .auth()
      .signInWithPopup(provider)
      .catch((error) => {
        fetchFailure(error);
      });

    LoginAuth(
      authRes,
      LogIn,
      firebase,
      fetchFailure,
      isInviteFlow,
      invite_key,
      location
    );
  };

  const seoData = {
    title: 'Saas Starter Kit Pro Login Page',
    description: 'Saas Starter Kit Pro Login Page'
  };

  return (
    <React.Fragment>
      <SEO seoData={seoData} />
      <div>
        {isLoading && <LoadingOverlay />}
        <LoginFormHeader />
        <AuthCard>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={handleSubmit}
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
                <Label htmlFor="email">Email:</Label>
                <InputWrapper>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </InputWrapper>
                {errors.email && touched.email && (
                  <ErrorText>{errors.email}</ErrorText>
                )}
                <Label htmlFor="password">Password:</Label>
                <InputWrapper>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </InputWrapper>
                {errors.password && touched.password && (
                  <ErrorText>{errors.password}</ErrorText>
                )}

                <Button type="submit">Signin</Button>
              </form>
            )}
          </Formik>
          <ForgotPasswordWrapper>
            <RememberMeWrapper>
              <input id="remember_me" name="remember_me" type="checkbox" />
              <RememberMeLabel htmlFor="remember_me">Remember me</RememberMeLabel>
            </RememberMeWrapper>

            <ForgotPassword>
              <Link href="/auth/passwordreset" passHref>
                <StyledLink>Forgot your password?</StyledLink>
              </Link>
            </ForgotPassword>
          </ForgotPasswordWrapper>

          {/*
          <ContinueWith />
          <GoogleButton GoogleSignin={GoogleSignin} />
          */}
        </AuthCard>
      </div>
    </React.Fragment>
  );
};

export default Login;
