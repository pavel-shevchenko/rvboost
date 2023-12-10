import { UserAddEditForm } from '@/app/(auth-protected)/users/_components/UserAddEditForm';

export default function UserCreate() {
  return <UserAddEditForm isEdit={false} />;
}
