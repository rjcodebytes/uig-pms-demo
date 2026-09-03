const BASE_URL = 'http://localhost:3005';

async function testAuthCookies() {
  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  const csrfData = await csrfRes.json();
  const csrfCookie = csrfRes.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');

  const res = await fetch(`${BASE_URL}/api/auth/signin/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': csrfCookie,
    },
    body: new URLSearchParams({
      csrfToken: csrfData.csrfToken,
      username: 'approver',
      password: 'password123',
      redirect: 'false',
    }),
  });

  console.log('Signin Response Status:', res.status);
  console.log('Signin Set-Cookie:', res.headers.getSetCookie());
  console.log('Signin Response URL/Text:', res.headers.get('location'), await res.text());
}

testAuthCookies();
