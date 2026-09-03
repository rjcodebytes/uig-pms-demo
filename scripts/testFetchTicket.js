async function test() {
  const res = await fetch("http://localhost:3005/api/v1/requests/PR-2026-88102");
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Data:", data);
}

test();
