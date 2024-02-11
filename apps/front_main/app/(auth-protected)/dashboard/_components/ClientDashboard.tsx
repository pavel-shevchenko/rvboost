import { useEffect, useState } from 'react';
import { useUserStore } from '@/services/stores/user';
import { useFetch } from '@/services/hooks';
import { env } from 'next-runtime-env';
import CommonDashboard from '@/app/(auth-protected)/dashboard/_components/CommonDashboard';
import { Alert, Card } from 'antd';

export default function ClientDashboard() {
  const authToken = useUserStore((state) => state.authToken);
  const fetch = useFetch(authToken);
  const [data, setData] = useState<any>();
  const [initialized, setInitialized] = useState(false);

  const init = async () => {
    const data = await fetch.get(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/analytics/get-client-dashboard-data`
    );
    setInitialized(true);
    setData(data);
  };

  useEffect(() => {
    if (authToken && !data) init();
  }, [authToken]);

  if (!initialized) return <></>;
  if (!data)
    return (
      <Card style={{ height: '100vh' }}>
        <br />
        <Alert
          type="warning"
          message="Ваш аккаунт не прикреплён к организации. Свяжитесь с администратором."
        />
      </Card>
    );

  return (
    <CommonDashboard
      title="Dashboard"
      reviewsLineBarChart={{
        title: 'Reviews',
        data: data.clientReviewsChartData
      }}
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
