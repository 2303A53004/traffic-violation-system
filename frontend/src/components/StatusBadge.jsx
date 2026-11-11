const colors = {
  Submitted: "#6b7280",
  "Under Review": "#6b7280",
  Validated: "#2563eb",
  Rejected: "#dc2626",
  Assigned: "#7c3aed",
  "In Progress": "#d97706",
  Resolved: "#16a34a",
};

export default function StatusBadge({ status }) {
  return (
    <span className="badge" style={{ background: colors[status] || "#6b7280" }}>
      {status}
    </span>
  );
}
