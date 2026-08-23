'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const roleNavItems = {
  Admin: [
    { href: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/admin/profile',   icon: '👤', label: 'Profile' },
    { label: 'MANAGE', type: 'section' },
    { href: '/admin/users',       icon: '👥', label: 'Users' },
    { href: '/admin/roles',       icon: '🏷️', label: 'Roles' },
    { href: '/admin/departments', icon: '🏢', label: 'Departments' },
    { href: '/admin/positions',   icon: '💼', label: 'Positions' },
    { href: '/admin/purchase',    icon: '📋', label: 'Purchase Types' },
  ],
  Approver: [
    { href: '/approver/dashboard',    icon: '🏠', label: 'Dashboard' },
    { href: '/approver/profile',      icon: '👤', label: 'Profile' },
    { label: 'PROCUREMENT', type: 'section' },
    { href: '/approver/procurement',  icon: '📄', label: 'Procurement Requests' },
    { href: '/approver/purchase',     icon: '📋', label: 'Purchase Types' },
  ],
  Initiator: [
    { href: '/initiator/dashboard',   icon: '🏠', label: 'Dashboard' },
    { href: '/initiator/profile',     icon: '👤', label: 'Profile' },
    { label: 'PROCUREMENT', type: 'section' },
    { href: '/initiator/procurement', icon: '📄', label: 'My Documents' },
  ],
  'Store Incharge': [
    { href: '/storeincharge/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/storeincharge/profile',   icon: '👤', label: 'Profile' },
    { label: 'PURCHASE', type: 'section' },
    { href: '/storeincharge/purchase',  icon: '🛒', label: 'Purchase Requests' },
  ],
  'Store Keeper': [
    { href: '/storekeeper/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/storekeeper/profile',   icon: '👤', label: 'Profile' },
    { label: 'PURCHASE', type: 'section' },
    { href: '/storekeeper/purchase',  icon: '🛒', label: 'Purchase Requests' },
  ],
};

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const items = roleNavItems[role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏛️</div>
        <div className="logo-text">
          <div>PMS</div>
          <div className="logo-sub">Purchase Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item, i) => {
          if (item.type === 'section') {
            return <div key={i} className="nav-section-label">{item.label}</div>;
          }
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={i} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
          <button
            className="nav-link w-full"
            style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', color: '#f87171' }}
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
