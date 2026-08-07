import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import RoleBadge from "./RoleBadge";
import { usersService } from "../../services";
import { formatDate } from "../../utils/format";
import {
  formatRoleLabel,
  getUserPrimaryRole,
} from "../../utils/userValidation";

const DetailItem = ({ label, value }) => (
  <div className="space-y-1">
    <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
      {label}
    </dt>
    <dd className="text-sm font-medium text-text-primary">{value}</dd>
  </div>
);

const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
    {children}
  </section>
);

const UserDetailsModal = ({ open, user, onClose, onEdit, onDelete }) => {
  const [detail, setDetail] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !user?.id) return undefined;

    let cancelled = false;

    const load = async () => {
      setDetail(user);
      setLoading(true);
      setError("");
      try {
        const response = await usersService.getById(user.id);
        const payload = response?.data?.data ?? response?.data ?? null;
        if (!cancelled) setDetail(payload || user);
      } catch (err) {
        if (!cancelled) {
          setDetail(user);
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load full user details.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [open, user]);

  const activeUser = detail || user;
  const primaryRole = getUserPrimaryRole(detail);
  const roles = Array.isArray(detail?.roles) ? detail.roles : [];
  const permissions = Array.isArray(detail?.permissions)
    ? detail.permissions
    : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="User Details"
      description="Profile, role, and access information."
      footer={
        <>
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={!activeUser}
            onClick={() => onDelete?.(activeUser)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
          <Button
            type="button"
            size="md"
            disabled={!activeUser}
            onClick={() => onEdit?.(activeUser)}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Button>
        </>
      }
    >
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-surface-muted"
            />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700"
        >
          {error}
        </div>
      ) : null}

      {!loading && detail ? (
        <div className="space-y-6">
          <Section title="General Information">
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Name" value={detail.name || "—"} />
              <DetailItem label="Email" value={detail.email || "—"} />
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Status
                </dt>
                <dd>
                  <StatusBadge isActive={detail.is_active} />
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Role
                </dt>
                <dd>
                  <RoleBadge role={primaryRole} />
                </dd>
              </div>
              <DetailItem
                label="Created"
                value={formatDate(detail.created_at)}
              />
              <DetailItem
                label="Updated"
                value={formatDate(detail.updated_at)}
              />
            </dl>
          </Section>

          {roles.length > 1 ? (
            <Section title="Assigned Roles">
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <RoleBadge key={role.id ?? role.name} role={role.name} />
                ))}
              </div>
            </Section>
          ) : null}

          <Section title="Permissions">
            {permissions.length > 0 ? (
              <ul className="space-y-1 text-sm text-text-secondary">
                {permissions.map((permission) => (
                  <li key={permission.id ?? permission.name ?? permission}>
                    {typeof permission === "string"
                      ? permission
                      : formatRoleLabel(permission.name) || permission.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">No direct permissions.</p>
            )}
          </Section>
        </div>
      ) : null}
    </Modal>
  );
};

export default UserDetailsModal;
