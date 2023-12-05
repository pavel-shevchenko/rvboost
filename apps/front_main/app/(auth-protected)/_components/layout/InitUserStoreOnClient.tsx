'use client';

import { useLayoutEffect } from 'react';
import {
  initUserStore,
  UserStoreState,
  useUserStore
} from '@/services/stores/user';

export function InitUserStoreOnClient({ state }: { state: UserStoreState }) {
  useLayoutEffect(() => {
    useUserStore.setState({ ...state });
  }, []);

  return <></>;
}
