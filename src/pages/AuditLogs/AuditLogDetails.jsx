import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ScrollText } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import Button from "../../components/ui/Button";
import ActionBadge from "../../components/audit-logs/ActionBadge";
import AuditLogsErrorState from "../../components/audit-logs/AuditLogsErrorState";
import { auditLogsService } from "../../services";
import { paths } from "../../routes/pathnames";
import { formatDate } from "../../utils/format";
import { shortAuditableType } from "../../utils/auditLogConstants";
import {
  entriesFromValues,
  formatAuditValue,
} from "../../utils/auditLogFormat";

const DetailItem = ({ label, value }) => (
  <div className="space-y-1">
    <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
      {label}
    </dt>
    <dd className="text-sm font-medium text-text-primary wrap-break-word">
      {value}
    </dd>
  </div>
);

const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
    {children}
  </section>
);

const ValuesGrid = ({ values, emptyLabel }) => {
  const entries = entriesFromValues(values);

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface-soft/50 px-4 py-6 text-sm text-text-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <dl className="grid gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <DetailItem
          key={key}
          label={String(key).replace(/_/g, " ")}
          value={
            <pre className="whitespace-pre-wrap font-sans text-sm font-medium text-text-primary">
              {formatAuditValue(value)}
            </pre>
          }
        />
      ))}
    </dl>
  );
};

const DetailsSkeleton = () => (
  <div className="space-y-4" aria-busy="true">
    <div className="h-40 animate-pulse rounded-2xl border border-border bg-surface" />
    <div className="h-48 animate-pulse rounded-2xl border border-border bg-surface" />
    <div className="h-48 animate-pulse rounded-2xl border border-border bg-surface" />
  </div>
);

const AuditLogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLog = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const response = await auditLogsService.getById(id);
      const payload = response?.data?.data ?? response?.data;
      if (!payload) throw new Error("Audit log not found.");
      setLog(payload);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load audit log.",
      );
      setLog(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const userName = log?.user?.name || log?.user?.email || (log ? `User #${log.user_id}` : "—");

  return (
    <PageScaffold
      title="Audit Log Details"
      description="View detailed information for this audit entry."
      documentTitle={log ? `Audit Log #${log.id}` : "Audit Log Details"}
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Audit Logs", to: paths.auditLogs },
        { label: log ? `#${log.id}` : "Details" },
      ]}
      actions={
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => navigate(paths.auditLogs)}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Audit Logs
        </Button>
      }
    >
      <div className="space-y-6">
        {loading ? <DetailsSkeleton /> : null}

        {!loading && error ? (
          <AuditLogsErrorState message={error} onRetry={fetchLog} />
        ) : null}

        {!loading && !error && log ? (
          <>
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-wanas-50 text-wanas-700">
                  <ScrollText className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-text-primary">
                    Audit Log #{log.id}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {shortAuditableType(log.auditable_type)}{" "}
                    {log.auditable_id != null ? `#${log.auditable_id}` : ""}
                  </p>
                </div>
                <ActionBadge action={log.action} />
              </div>

              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="User" value={userName} />
                <DetailItem
                  label="User email"
                  value={log.user?.email || "—"}
                />
                <DetailItem
                  label="Auditable type"
                  value={shortAuditableType(log.auditable_type)}
                />
                <DetailItem
                  label="Auditable ID"
                  value={
                    log.auditable_id != null ? `#${log.auditable_id}` : "—"
                  }
                />
                <DetailItem label="IP address" value={log.ip_address || "—"} />
                <DetailItem
                  label="Created"
                  value={formatDate(log.created_at)}
                />
                <DetailItem
                  label="Updated"
                  value={formatDate(log.updated_at)}
                />
                <DetailItem
                  label="User agent"
                  value={
                    <span className="block max-w-full break-all text-xs font-normal text-text-secondary">
                      {log.user_agent || "—"}
                    </span>
                  }
                />
              </dl>
            </section>

            <Section title="Old Values">
              <ValuesGrid
                values={log.old_values}
                emptyLabel="No previous values (create or empty snapshot)."
              />
            </Section>

            <Section title="New Values">
              <ValuesGrid
                values={log.new_values}
                emptyLabel="No new values recorded."
              />
            </Section>

            {log.auditable ? (
              <Section title="Auditable Snapshot">
                <ValuesGrid
                  values={log.auditable}
                  emptyLabel="No auditable snapshot available."
                />
              </Section>
            ) : null}
          </>
        ) : null}
      </div>
    </PageScaffold>
  );
};

export default AuditLogDetails;
