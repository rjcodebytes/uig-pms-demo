import { auth } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';

export default async function ProcurementLayout({ children }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar user={session?.user} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
