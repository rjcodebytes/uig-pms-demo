'use client';
import Link from 'next/link';

export default function Header({ title, user }) {
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">
        <Link href={`/${user?.role?.toLowerCase().replace(' ', '')}/profile`} style={{ textDecoration: 'none' }}>
          <div className="user-chip">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
