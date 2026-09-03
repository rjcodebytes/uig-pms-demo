async function debugMockServer() {
  const listRes = await fetch('http://localhost:3005/api/v1/requests');
  const listData = await listRes.json();
  console.log('Total tickets on server:', listData.data?.length);
  console.log('Ticket IDs:', listData.data?.map(r => ({ id: r._id, ticketId: r.ticketId, status: r.status })));
}

debugMockServer();
