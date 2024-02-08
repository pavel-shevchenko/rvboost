'use client';

import { useParams } from 'next/navigation';
import FeedbackAddEditForm from '@/app/(auth-protected)/feedback/_components/AddEditForm';

export default function FeedbackEditPage() {
  const { id } = useParams<{ id: string }>();

  return <FeedbackAddEditForm id={id} />;
}
