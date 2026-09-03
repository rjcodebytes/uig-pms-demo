import { encode } from 'next-auth/jwt';

const BASE_URL = 'http://localhost:3005';
const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production-32chars';

async function generateRoleCookie(role, name, username) {
  const token = {
    id: `user-${username}`,
    name,
    username,
    email: `${username}@uig.com`,
    role,
    roleId: `role-${role}`,
  };

  const encoded = await encode({
    token,
    secret,
    salt: 'authjs.session-token',
  });

  return `authjs.session-token=${encoded}`;
}

async function debugStep() {
  const approverCookie = await generateRoleCookie('Approver', 'Dr. Tariq', 'approver');
  const targetId = 'PR-2026-88102'; // existing ticket in mockDb in Technical_Approval stage

  console.log(`Calling technical-approve on ${targetId}...`);
  const res = await fetch(`${BASE_URL}/api/v1/requests/${targetId}/technical-approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': approverCookie,
    },
    body: JSON.stringify({ isApproved: true, notes: 'Approved' }),
  });

  console.log('Status:', res.status);
  console.log('Body:', await res.json());
}

debugStep();
