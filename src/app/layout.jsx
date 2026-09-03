import './globals.css';
import { auth } from '@/lib/auth';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata = {
  title: 'UIG PMS – Enterprise Procurement & Lifecycle Management',
  description: 'Saudi Corporate Enterprise Procurement & Lifecycle Platform',
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
