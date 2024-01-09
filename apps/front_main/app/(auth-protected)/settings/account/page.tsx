'use client';

import styled from 'styled-components';
import { Button, Card, Input, message } from 'antd';

import { FieldLabel } from '@/app/_components/common/forms';
import { useUserStore } from '@/services/stores/user';
import { useEffect, useState } from 'react';
import { useFetch } from '@/services/hooks';
import { env } from 'next-runtime-env';

const Title = styled.h1`
  font-size: 1.5rem;
`;

const StyledCard = styled(Card)`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  padding-top: 1.5rem;
`;

const FormWrapper = styled.form`
  padding-bottom: 1.5rem;
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
`;

export default function AccountSettings() {
  const authToken = useUserStore((state) => state.authToken);
  const fetch = useFetch(authToken);
  const [username, setUsername] = useState('');

  const storedName = useUserStore((state) => state.username);
  const changeStoredUsername = useUserStore((state) => state.changeUsername);

  useEffect(() => {
    if (storedName && !username) setUsername(storedName);
  }, [storedName]);

  const onSave = async () => {
    if (!username) {
      message.error('Имя не должно быть пустым!');
      return;
    }
    if (username.length > 255) {
      message.error('Имя не должно быть длиннее 255 символов!');
      return;
    }
    const res = await fetch.post(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/user/change-username/${username}`
    );
    message.success('Имя успешно сохранено!');
    changeStoredUsername(username);
  };

  return (
    <>
      <Title>Настройки аккаунта</Title>
      {username && (
        <StyledCard>
          <SectionTitle>Данные пользователя</SectionTitle>
          <FormWrapper>
            <FieldLabel htmlFor="title">
              Имя:
              <Input
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FieldLabel>
            <ButtonWrapper>
              <Button onClick={onSave}>Сохранить</Button>
            </ButtonWrapper>
          </FormWrapper>
        </StyledCard>
      )}
    </>
  );
}
