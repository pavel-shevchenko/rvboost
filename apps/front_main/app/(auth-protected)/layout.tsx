import { initUserStore } from '@/services/stores/user';
import { LayoutClientSide } from '@/app/(auth-protected)/_components/layout';

// Important for separating zustand-state of users at calling initUserStore()
export const revalidate = 0;

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
