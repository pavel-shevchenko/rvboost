import { useEffect, useState } from 'react';
import { useUserStore } from '@/services/stores/user';
import { useFetch } from '@/services/hooks';
import { env } from 'next-runtime-env';
import CommonDashboard from '@/app/(auth-protected)/dashboard/_components/CommonDashboard';

export default function AdminDashboard() {
  const authToken = useUserStore((state) => state.authToken);
  const fetch = useFetch(authToken);
  const [data, setData] = useState<any>();

  const init = async () => {
    const data = await fetch.get(
      `${env('NEXT_PUBLIC_SERVER_URL')}/api/analytics/get-admin-dashboard-data`
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
      stackedChart={{ title: 'Clicks', data: data.adminClicksChartData }}
      stats={[
        {
          title: 'общее количество юзеров с ролью не админ',
          value: data.nonAdminUsersCount
        },
        { title: 'общее количество компаний', value: data.allLocationsCount },
        { title: 'общее количество QR карт', value: data.allCardsCount },
        { title: 'общее количество отзывов', value: data.allReviewsCount },
        {
          title: 'общее количество переходов за сегодня',
          value: data.todayExtFolEventsCount
        }
      ]}
    />
  );
}
