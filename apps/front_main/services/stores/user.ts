import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { env } from 'next-runtime-env';

import { IUser } from 'typing';
import { LocalLoginDto } from 'validation/src/dto/local_login';
import { LocalRegistrationDto } from 'validation/src/dto/local_registration';
import { useFetch } from '@/services/hooks/useFetch';
import {
  getCookie,
  setCookie,
  delCookie
} from '@/services/server-actions/cookie';

const AuthCookieName = 'auth_token';

export const initUserStore = async () => {
  const authToken = await getCookie(AuthCookieName);
  const fetch = useFetch(authToken);
  const currentUser = await fetch.get(
    `${env('NEXT_PUBLIC_SERVER_URL')}/api/user/current-user-info`
  );

  const state: UserStoreState = { authToken, ...currentUser };
  useUserStore.setState(state);
  return state;
};

export type UserStoreState = IUser & {
  authToken: string;
};

type UserStoreActions = {
  login: (dto: LocalLoginDto) => Promise<void>;
  register: (dto: LocalRegistrationDto) => Promise<void>;
  logout: () => void;
};

type UserStore = UserStoreState & UserStoreActions;

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    authToken: '',
    email: '',
    username: '',
    isAdmin: null,
    login: async (dto: LocalLoginDto) => {
      const fetch = useFetch('_STUB', false);
      const res = await fetch.post(
        `${env('NEXT_PUBLIC_SERVER_URL')}/api/auth/local-login`,
        dto
      );
      const authToken = res?.access_token;
      const currentUser = res?.user;

      set({ authToken, ...currentUser });
      await setCookie(AuthCookieName, authToken);
    },
    register: async (dto: LocalRegistrationDto) => {
      const fetch = useFetch();
      const res = await fetch.post(
        `${env('NEXT_PUBLIC_SERVER_URL')}/api/auth/local-registration`,
        dto
      );
      const authToken = res?.access_token;
      const currentUser = res?.user;

      setCookie(AuthCookieName, authToken);
      set({ authToken, ...currentUser });
    },
    logout: () => delCookie(AuthCookieName)
  }))
);
