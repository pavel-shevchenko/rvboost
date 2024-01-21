import { initUserStore } from '@/services/stores/user';
import { LayoutClientSide } from '@/app/(auth-protected)/_components/layout';

export default async function PrivateCabinetLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LayoutClientSide userInitState={await initUserStore()}>
        {children}
      </LayoutClientSide>
    </>
  );
}
