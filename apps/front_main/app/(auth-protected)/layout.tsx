import { redirect } from 'next/navigation';
import { initUserStore } from '@/services/stores/user';
import { Routes } from '@/services/helpers/routes';
import {
  InitUserStoreOnClient,
  LayoutClientSide
} from '@/app/(auth-protected)/_components/layout';

// Important for separating zustand-state of users
export const revalidate = 0;

export default async function PrivateCabinetLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let userStoreInitState; // Check auth and init user store on server
  try {
    userStoreInitState = await initUserStore();
  } catch (e) {
    redirect(Routes.login);
  }

  return (
    <>
      <InitUserStoreOnClient state={userStoreInitState} />

      <LayoutClientSide>{children}</LayoutClientSide>
    </>
  );
}
