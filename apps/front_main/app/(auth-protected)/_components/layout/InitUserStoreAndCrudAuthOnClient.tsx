'use client';

import { useLayoutEffect } from 'react';
import { axiosInstance } from '@refinedev/nestjsx-crud';

import { UserStoreState, useUserStore } from '@/services/stores/user';

export function InitUserStoreAndCrudAuthOnClient({
  userInitState
}: {
  userInitState: UserStoreState | undefined;
}) {
  useLayoutEffect(() => {
    if (!userInitState) return;

    useUserStore.setState({ ...userInitState });

    axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${userInitState.authToken}`;
  }, [userInitState]);

  return <></>;
}
