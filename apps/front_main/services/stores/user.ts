import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { env } from 'next-runtime-env';

import { LocalLoginDto } from 'validation/src/dto/local_login';
import { LocalRegistrationDto } from 'validation/src/dto/local_registration';
import { useFetch } from '@/services/hooks';
import { setCookie, delCookie } from '@/services/helpers/cookie';
import { User } from '@/services/typing/entities';

export const AuthCookieName = 'auth_token';

export const loadCurrentUser = async (authToken: string) => {
  const fetch = useFetch(authToken);
  return fetch.get(`${env('NEXT_PUBLIC_SERVER_URL')}/api/user/current-user-info`);
};

export type UserStoreState = User & {
  authToken: string;
};

type UserStoreActions = {
  login: (dto: LocalLoginDto) => Promise<void>;
  register: (dto: LocalRegistrationDto) => Promise<void>;
  logout: () => void;
  loadUserAndPersistToken: (authToken: string) => Promise<void>;
  changeUsername: (username: string) => void;
};

type UserStore = UserStoreState & UserStoreActions;

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    authToken: '',
    id: 0,
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
      // Important await before redirect to have actual state after redirect
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

      set({ authToken, ...currentUser });
      // Important await before redirect to have actual state after redirect
      await setCookie(AuthCookieName, authToken);
    },
    logout: () => delCookie(AuthCookieName),
    loadUserAndPersistToken: async (authToken: string) => {
      const currentUser = await loadCurrentUser(authToken);

      set({ authToken, ...currentUser });
      // Important await before redirect to have actual state after redirect
      await setCookie(AuthCookieName, authToken);
    },
    changeUsername: (username: string) => set({ username })
  }))
);
