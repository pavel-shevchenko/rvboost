'use server';

import { notFound } from 'next/navigation';
import { env } from 'next-runtime-env';

import { useFetch } from '@/services/hooks';
import ClientSideForm from '@/app/review-interception/[code]/_components/ClientSideForm';
import { ReviewInterceptionHydration } from '@/services/typing';
import { Card, Location, Organization } from '@/services/typing/entities';

export default async function FormPage({ params }: { params: { code: string } }) {
  const fetch = useFetch();
  const org: Organization = await fetch.get(
    `${env(
      'NEXT_PUBLIC_SERVER_URL'
    )}/api/organization/get-populated-org-for-review-interception-secured52735/${
      params.code
    }`
  );
  const fbSettings = org?.feedbackSettings;
  const location = org?.locations?.pop();
  const card = location?.card;

  if (!org || !fbSettings || !location || !card?.isReviewInterception) {
    return notFound();
  }

  const data: ReviewInterceptionHydration = {
    shortLinkCode: params.code,
    logo: fbSettings.logoS3Key
      ? `${env('NEXT_PUBLIC_SERVER_URL')}/api/review/logo-by-s3key/${
          fbSettings.logoS3Key
        }`
      : undefined
  };

  return <ClientSideForm {...{ data }} />;
}
