import { STATUSES } from '../utils/constants';

export default function StatusBadge({ status }) {
  const config = STATUSES[status];
  if (!config) return null;

  return (
    <span
      className="status-badge"
      style={{
        color: config.color,
        borderColor: `${config.color}33`,
        background: `${config.color}15`,
      }}
    >
      {config.label}
    </span>
  );
}
