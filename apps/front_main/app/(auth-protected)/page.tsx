import { redirect } from 'next/navigation';
import { Routes } from '@/services/helpers/routes';

export default async function MainpageRedirect() {
  redirect(Routes.dashboard);
}
