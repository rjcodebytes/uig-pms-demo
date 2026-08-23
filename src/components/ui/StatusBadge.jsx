export default function StatusBadge({ status }) {
  const map = {
    Pending:      'badge badge-pending',
    Approved:     'badge badge-approved',
    Rejected:     'badge badge-rejected',
    Complete:     'badge badge-complete',
    'Not Complete': 'badge badge-rejected',
  };
  const dots = { Pending: '●', Approved: '●', Rejected: '●', Complete: '●', 'Not Complete': '●' };
  return (
    <span className={map[status] || 'badge badge-pending'}>
      {dots[status] || '●'} {status || 'Pending'}
    </span>
  );
}
