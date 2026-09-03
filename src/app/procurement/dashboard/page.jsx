'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import InitiatorPortal from '@/components/portals/InitiatorPortal';
import ApproverPortal from '@/components/portals/ApproverPortal';
import FinancePortal from '@/components/portals/FinancePortal';
import StorekeeperPortal from '@/components/portals/StorekeeperPortal';
import AdminMasterDashboard from '@/components/portals/AdminMasterDashboard';

export default function ProcurementDashboard() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'Admin';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/requests?role=Management')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRequests(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs font-semibold text-slate-500">Loading {userRole} Workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Role-Specific Home Screen Loading */}
      {userRole === 'Initiator' && <InitiatorPortal requests={requests} />}
      {userRole === 'Approver' && <ApproverPortal requests={requests} />}
      {userRole === 'Store Incharge' && <FinancePortal requests={requests} />}
      {userRole === 'Store Keeper' && <StorekeeperPortal requests={requests} />}
      {userRole === 'Admin' && <AdminMasterDashboard requests={requests} />}
    </div>
  );
}
