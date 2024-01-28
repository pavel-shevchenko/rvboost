'use client';

import { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { env } from 'next-runtime-env';

import { capitalize } from '@/services/helpers/misc';
import { SocialAuthProvider } from '@/services/typing/misc';
import { Routes } from '@/services/helpers/routes';
import { useUserStore } from '@/services/stores/user';

const openSocialAuth = (service: SocialAuthProvider) =>
  window.open(
    `${env('NEXT_PUBLIC_SERVER_URL')}/api/auth/${service}`,
    capitalize(service) + ' authentication',
    'toolbar=0,statusbar=0,menubar=0,width=333,height=580'
  );

export const useSocialsAuth = () => {
  const router = useRouter();
  const lUaPt = useUserStore((state) => state.loadUserAndPersistToken);

  useLayoutEffect(() => {
    // @ts-ignore
    window.socialsAuthCallback = async (authToken: string) => {
      if (!authToken) throw new Error('Empty authToken!');

      await lUaPt(authToken);
      router.push(Routes.dashboard);
    };
  }, []);

  return { openSocialAuth };
};
