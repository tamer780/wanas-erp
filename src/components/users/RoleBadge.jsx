import { formatRoleLabel } from "../../utils/userValidation";

const RoleBadge = ({ role }) => {
  if (!role) {
    return <span className="text-sm text-text-muted">—</span>;
  }

  return (
    <span className="inline-flex items-center rounded-lg bg-wanas-50 px-2.5 py-1 text-xs font-semibold text-wanas-700">
      {formatRoleLabel(role)}
    </span>
  );
};

export default RoleBadge;
