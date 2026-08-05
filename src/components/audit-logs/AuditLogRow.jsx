import { motion, useReducedMotion } from "framer-motion";
import ActionBadge from "./ActionBadge";
import { formatDate } from "../../utils/format";
import { shortAuditableType } from "../../utils/auditLogConstants";
import { rowEntrance } from "../../utils/listMotion";

const AuditLogRow = ({
  log,
  onView,
  index = 0,
  animateEntrance = false,
}) => {
  const reduceMotion = useReducedMotion();
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);
  const userName = log.user?.name || log.user?.email || `User #${log.user_id}`;
  const typeLabel = shortAuditableType(log.auditable_type);

  const handleActivate = () => {
    onView?.(log);
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
      aria-label={`View audit log ${log.id}`}
    >
      <td className="min-w-[140px] px-4 py-3.5 text-sm font-medium text-text-primary">
        <div>{userName}</div>
        {log.user?.email ? (
          <div className="mt-0.5 text-xs font-normal text-text-muted">
            {log.user.email}
          </div>
        ) : null}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <ActionBadge action={log.action} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {typeLabel}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {log.auditable_id != null ? `#${log.auditable_id}` : "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {log.ip_address || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(log.created_at)}
      </td>
    </motion.tr>
  );
};

export default AuditLogRow;
