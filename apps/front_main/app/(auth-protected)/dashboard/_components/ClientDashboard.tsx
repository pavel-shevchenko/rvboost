import { useEffect, useState } from 'react';
import { useUserStore } from '@/services/stores/user';
import { useFetch } from '@/services/hooks';
import { env } from 'next-runtime-env';
import CommonDashboard from '@/app/(auth-protected)/dashboard/_components/CommonDashboard';

export default function ClientDashboard() {
  const authToken = useUserStore((state) => state.authToken);
  const fetch = useFetch(authToken);
  const [data, setData] = useState<any>();

  const init = async () => {
    const data = await fetch.get(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/analytics/get-client-dashboard-data`
    );
    setData(data);
  };

  useEffect(() => {
    if (authToken && !data) init();
  }, [authToken]);

  if (!data) return <></>;
  return (
    <CommonDashboard
      title="Dashboard"
      clicksStackedChart={{ title: 'Clicks', data: data.clientClicksChartData }}
      stats={[
        {
          title: 'переходов по ссылкам на внешний источник по всем компаниям',
          value: data.externalFollowEventsCnt
        },
        {
          title: 'перехваченных негативных отзывов по всем компаниям',
          value: data.submitBadFormEventsCnt
        }
      ]}
    />
  );
}
