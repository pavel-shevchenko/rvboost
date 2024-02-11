'use client';

import { Can } from '@/services/casl/common';
import AdminDashboard from '@/app/(auth-protected)/dashboard/_components/AdminDashboard';
import ClientDashboard from '@/app/(auth-protected)/dashboard/_components/ClientDashboard';

export default function Dashboard() {
  return (
    <>
      <Can do="manage" on="all">
        <AdminDashboard />
      </Can>
      <Can not do="manage" on="all">
        <ClientDashboard />
      </Can>
    </>
  );
}
