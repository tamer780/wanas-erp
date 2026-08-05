import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import { contractorsService } from "../../services";
import {
  formatDate,
  formatMoney,
  translationText,
} from "../../utils/format";

const DetailItem = ({ label, value, dir }) => (
  <div className="space-y-1">
    <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
      {label}
    </dt>
    <dd className="text-sm font-medium text-text-primary" dir={dir}>
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

const WORK_ITEM_STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const ContractorDetailsModal = ({
  open,
  contractor,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [detail, setDetail] = useState(contractor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !contractor?.id) return undefined;

    let cancelled = false;

    const load = async () => {
      setDetail(contractor);
      setLoading(true);
      setError("");
      try {
        const response = await contractorsService.getById(contractor.id);
        const payload = response?.data?.data ?? response?.data ?? null;
        if (!cancelled) setDetail(payload || contractor);
      } catch (err) {
        if (!cancelled) {
          setDetail(contractor);
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load full contractor details.",
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
  }, [open, contractor]);

  const activeContractor = detail || contractor;
  const workItems = detail?.work_items || [];
  const payments = detail?.payments || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="Contractor Details"
      description="Profile, work items, and payments."
      footer={
        <>
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={!activeContractor}
            onClick={() => onDelete?.(activeContractor)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
          <Button
            type="button"
            size="md"
            disabled={!activeContractor}
            onClick={() => onEdit?.(activeContractor)}
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
              <DetailItem
                label="Arabic Name"
                value={translationText(detail.name, "ar")}
                dir="rtl"
              />
              <DetailItem
                label="English Name"
                value={translationText(detail.name, "en")}
              />
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Status
                </dt>
                <dd>
                  <StatusBadge isActive={detail.is_active} />
                </dd>
              </div>
              <DetailItem
                label="Created"
                value={formatDate(detail.created_at)}
              />
            </dl>
          </Section>

          <Section title="Contact">
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Email" value={detail.email || "—"} />
              <DetailItem label="Phone" value={detail.phone || "—"} />
              <DetailItem label="Address" value={detail.address || "—"} />
              <DetailItem label="Tax ID" value={detail.tax_id || "—"} />
            </dl>
          </Section>

          <Section title="Notes">
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Arabic Notes"
                value={translationText(detail.notes, "ar")}
                dir="rtl"
              />
              <DetailItem
                label="English Notes"
                value={translationText(detail.notes, "en")}
              />
            </dl>
          </Section>

          <Section title="Work Items">
            {workItems.length === 0 ? (
              <p className="rounded-xl border border-border bg-surface-soft/50 px-4 py-6 text-center text-sm text-text-muted">
                No work items linked to this contractor.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-surface-soft/80">
                        {[
                          "Title",
                          "Type",
                          "Agreed",
                          "Paid",
                          "Status",
                          "Start",
                        ].map((col) => (
                          <th
                            key={col}
                            className="whitespace-nowrap px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {workItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border last:border-b-0"
                        >
                          <td className="px-3 py-2.5 text-sm text-text-primary">
                            {translationText(item.title, "en")}
                          </td>
                          <td className="px-3 py-2.5 text-sm capitalize text-text-secondary">
                            {item.workable_type || "—"}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-text-secondary">
                            {formatMoney(item.agreed_amount)}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-text-secondary">
                            {formatMoney(item.paid_amount)}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-text-secondary">
                            {WORK_ITEM_STATUS_LABELS[item.status] ||
                              item.status ||
                              "—"}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-text-secondary">
                            {formatDate(item.start_date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Section>

          <Section title="Payments">
            {payments.length === 0 ? (
              <p className="rounded-xl border border-border bg-surface-soft/50 px-4 py-6 text-center text-sm text-text-muted">
                No payments recorded for this contractor.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-surface-soft/80">
                        {["ID", "Amount", "Status", "Date"].map((col) => (
                          <th
                            key={col}
                            className="whitespace-nowrap px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-border last:border-b-0"
                        >
                          <td className="px-3 py-2.5 text-sm text-text-primary">
                            #{payment.id}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-text-secondary">
                            {formatMoney(
                              payment.amount ?? payment.total_amount,
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-sm capitalize text-text-secondary">
                            {payment.status || "—"}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-text-secondary">
                            {formatDate(
                              payment.paid_at ??
                                payment.due_date ??
                                payment.payment_date ??
                                payment.created_at,
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Section>
        </div>
      ) : null}
    </Modal>
  );
};

export default ContractorDetailsModal;
