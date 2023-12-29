'use client';

import { useLayoutEffect } from 'react';
import { axiosInstance } from '@refinedev/nestjsx-crud';

import { UserStoreState, useUserStore } from '@/services/stores/user';

export function InitUserStoreAndCrudAuthOnClient({
  state
}: {
  state: UserStoreState;
}) {
  useLayoutEffect(() => {
    useUserStore.setState({ ...state });

    axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${state.authToken}`;
  }, []);

  return <></>;
}
