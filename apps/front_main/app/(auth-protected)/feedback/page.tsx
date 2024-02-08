'use client';

import FeedbackAddEditForm from '@/app/(auth-protected)/feedback/_components/AddEditForm';
import { useContext } from 'react';
import { CaslContext } from '@/services/casl/common';
import { PermissionSubject } from 'casl/src/legacy_typing';
import ListTable from '@/app/(auth-protected)/feedback/_components/ListTable';

export default function FeedbackPage() {
  const ctxCan = useContext(CaslContext);

  if (ctxCan.can('manage', PermissionSubject.entityFbSettings))
    return <ListTable />;
  else return <FeedbackAddEditForm />;
}
