import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { Spin } from 'antd';
import SEO from '../../../components/Marketing/Layout/seo';
import AuthContext from '../../../utils/authContext';
import ApiContext from '../../../utils/apiContext';
import axios from '../../../services/axios';
import {
  setAnalyticsUserId,
  sendEventToAnalytics
} from '../../../services/analytics';
import { colors, breakpoints } from '../../../styles/theme';

import TitleBase from '../../../components/Auth/title';
import AuthCard from '../../../components/Auth/authCard';
import LoadingOverlay from '../../../components/Common/loadingOverlay';
import FieldLabel from '../../../components/Common/forms/FieldLabel';
import TextInput from '../../../components/Common/forms/TextInput';
import Button from '@components/Auth/Buttons/authButton';

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

const Title = styled(TitleBase)`
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

const PasswordRestore = () => {
  const location = useRouter();

  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState();
  const [token, setToken] = useState();
  const [loadingSpin, setLoading] = useState(false);
  const { fetchFailure, fetchInit, fetchSuccess, apiState } =
    useContext(ApiContext);
  const { isLoading } = apiState;

  /* eslint-disable */
  useEffect(() => {
    if (!location.isReady) return;

    setEmail(location.query.email);
    setToken(location.query.token);

    console.log(email, token);
  }, [location.isReady, email, token]);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let newPassword = event.target.newPassword.value;
    if (newPassword.length < 7) {
      alert('Password must be at least 7 chars');
      return;
    }

    let data = {
      email,
      token,
      newPassword
    };

    await axios.post('/api/auth/restore-password', data).catch((err) => {
      fetchFailure(err);
    });

    fetchSuccess();
    setSuccessMessage('Password changed successfully');
    location.push('/auth/login');
  };

  const seoData = {
    title: 'Saas Starter Kit Pro Reset Password',
    description: 'Saas Starter Kit Pro Reset Password Page'
  };

  return (
    <React.Fragment>
      <SEO seoData={seoData} />
      <Wrapper>
        {isLoading && <LoadingOverlay />}
        <Title>Enter New Password</Title>
        <Spin
          tip="Please wait while we setup your account..."
          spinning={loadingSpin}
        >
          <AuthCard>
            <SuccessResponse>{successMessage}</SuccessResponse>
            {!successMessage && (
              <div>
                <form onSubmit={handleSubmit}>
                  <FieldLabel htmlFor="newPassword">
                    New Password (min 7 chars):
                    <TextInput id="newPassword" name="newPassword" />
                  </FieldLabel>
                  <Button type="submit">Complete</Button>
                </form>
              </div>
            )}
          </AuthCard>
        </Spin>
      </Wrapper>
    </React.Fragment>
  );
};

export default PasswordRestore;
