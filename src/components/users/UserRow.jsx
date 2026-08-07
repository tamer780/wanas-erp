import { motion, useReducedMotion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import RoleBadge from "./RoleBadge";
import { formatDate } from "../../utils/format";
import { rowEntrance } from "../../utils/listMotion";
import { getUserPrimaryRole } from "../../utils/userValidation";

const UserRow = ({ user, onView, index = 0, animateEntrance = false }) => {
  const reduceMotion = useReducedMotion();
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);
  const displayName = user.name || "—";
  const role = getUserPrimaryRole(user);

  const handleActivate = () => {
    onView?.(user);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  return (
    <motion.tr
      {...motionProps}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className="cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-surface-soft/70 focus-visible:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wanas-600"
      aria-label={`View details for ${displayName}`}
    >
      <td className="min-w-[160px] px-4 py-3.5 text-sm font-medium text-text-primary">
        {displayName}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {user.email || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <RoleBadge role={role} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge isActive={user.is_active} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(user.created_at)}
      </td>
    </motion.tr>
  );
};

export default UserRow;
