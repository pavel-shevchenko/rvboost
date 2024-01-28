'use server';

import { getCookie } from '@/services/helpers/cookie';
import {
  AuthCookieName,
  loadCurrentUser,
  UserStoreState,
  useUserStore
} from '@/services/stores/user';

export const initUserStoreByAuthCookie = async () => {
  'use server';

  const authToken = await getCookie(AuthCookieName);

  const currentUser = await loadCurrentUser(String(authToken));

  const state: UserStoreState = { authToken, ...currentUser };
  useUserStore.setState(state);
  return state;
};
