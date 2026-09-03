import { encode } from 'next-auth/jwt';

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production-32chars';

async function generateTestToken(role, name, username) {
  const token = {
    id: `test-${username}`,
    name,
    username,
    email: `${username}@uig.com`,
    role,
    roleId: `role-${role}`,
    position: `${role} Lead`,
    department: 'Procurement & Engineering',
  };

  const encoded = await encode({
    token,
    secret,
    salt: 'authjs.session-token',
  });

  return `authjs.session-token=${encoded}`;
}

async function testToken() {
  const cookie = await generateTestToken('Approver', 'Project Approver', 'approver');
  console.log('Generated NextAuth Token Cookie:', cookie);

  const testRes = await fetch('http://localhost:3005/api/v1/requests/PR-2026-88102/technical-approve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
    },
    body: JSON.stringify({ isApproved: true }),
  });
  console.log('Status with Encoded JWT:', testRes.status);
  const data = await testRes.json();
  console.log('Response body:', data);
}

testToken();
