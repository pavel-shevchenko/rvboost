import { LayoutClientSide } from '@/app/(auth-protected)/_components/layout';
import { initUserStoreByAuthCookie } from '@/services/server-actions';

export default async function PrivateCabinetLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LayoutClientSide userInitState={await initUserStoreByAuthCookie()}>
        {children}
      </LayoutClientSide>
    </>
  );
}
