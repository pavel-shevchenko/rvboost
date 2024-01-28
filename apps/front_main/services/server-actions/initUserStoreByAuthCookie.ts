'use server';

import { getCookie } from '@/services/server-actions/cookie';
import {
  AuthCookieName,
  loadCurrentUser,
  UserStoreState,
  useUserStore
} from '@/services/stores/user';

export const initUserStoreByAuthCookie = async () => {
  'use server';

  const authToken = await getCookie(AuthCookieName);
  if (!authToken) return;

  const currentUser = await loadCurrentUser(authToken);

  const state: UserStoreState = { authToken, ...currentUser };
  useUserStore.setState(state);
  return state;
};
