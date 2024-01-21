'use server';

import { env } from 'next-runtime-env';
import { useFetch } from '@/services/hooks';
import ClientSideForm from '@/app/review-interception/[code]/_components/ClientSideForm';
import { ReviewInterceptionHydration } from '@/services/typing';

export default async function FormPage({ params }: { params: { code: string } }) {
  const fetch = useFetch();
  const res = await fetch.get(
    `${env(
      'NEXT_PUBLIC_SERVER_URL'
    )}/api/organization/get-populated-org-for-review-interception-secured52735/${
      params.code
    }`
  );

  const data: ReviewInterceptionHydration = {
    shortLinkCode: params.code
  };

  return <ClientSideForm {...{ data }} />;
}
