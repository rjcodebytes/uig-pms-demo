import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default async function DashboardLayout({ children, title }) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div>
      <Sidebar role={session.user.role} />
      <div className="main-wrapper">
        <Header title={title || 'Dashboard'} user={session.user} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
