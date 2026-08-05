import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import { materialPurchasesService } from "../../services";
import {
  formatDate,
  formatMoney,
  toNumber,
  translationText,
} from "../../utils/format";

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

const MaterialPurchaseDetailsModal = ({
  open,
  item,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [detail, setDetail] = useState(item);
  const [loading, setLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    if (!open || !item?.id) return undefined;

    let cancelled = false;

    const loadDetail = async () => {
      setLoading(true);
      setDetailError("");
      setDetail(item);
      try {
        const response = await materialPurchasesService.getById(item.id);
        const payload = response?.data?.data ?? response?.data ?? null;
        if (!cancelled) setDetail(payload || item);
      } catch (err) {
        if (!cancelled) {
          setDetail(item);
          setDetailError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load full purchase details.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [open, item]);

  const active = detail || item;
  const supplier = active?.supplier;
  const land = active?.land;
  const building = active?.building;
  const schedules = active?.payment_schedules || [];
  const remaining = Math.max(
    toNumber(active?.total_amount) - toNumber(active?.paid_amount),
    0,
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="Material Purchase Details"
      description="Purchase overview and linked payment schedules."
      footer={
        <>
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={!active}
            onClick={() => onDelete?.(active)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
          <Button
            type="button"
            size="md"
            disabled={!active}
            onClick={() => onEdit?.(active)}
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

      {!loading && detailError ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700"
        >
          {detailError}
        </div>
      ) : null}

      {!loading && active ? (
        <div className="space-y-6">
          <Section title="Overview">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem
                label="English Title"
                value={translationText(active.title, "en")}
              />
              <DetailItem
                label="Arabic Title"
                value={translationText(active.title, "ar")}
              />
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Status
                </dt>
                <dd>
                  <StatusBadge status={active.status} />
                </dd>
              </div>
              <DetailItem
                label="Invoice Number"
                value={active.invoice_number || "—"}
              />
              <DetailItem
                label="Total Amount"
                value={formatMoney(active.total_amount)}
              />
              <DetailItem
                label="Paid Amount"
                value={formatMoney(active.paid_amount)}
              />
              <DetailItem label="Remaining" value={formatMoney(remaining)} />
              <DetailItem
                label="Purchase Date"
                value={formatDate(active.purchase_date)}
              />
              <DetailItem
                label="Created At"
                value={formatDate(active.created_at)}
              />
              <DetailItem
                label="Supplier"
                value={
                  translationText(supplier?.name, "en") !== "—"
                    ? translationText(supplier?.name, "en")
                    : "—"
                }
              />
              <DetailItem
                label="Land"
                value={
                  translationText(land?.name, "en") !== "—"
                    ? translationText(land?.name, "en")
                    : land?.code || "—"
                }
              />
              <DetailItem
                label="Building"
                value={
                  translationText(building?.name, "en") !== "—"
                    ? translationText(building?.name, "en")
                    : building?.code || "—"
                }
              />
              <DetailItem
                label="English Notes"
                value={translationText(active.notes, "en")}
              />
              <DetailItem
                label="Arabic Notes"
                value={translationText(active.notes, "ar")}
              />
            </dl>
          </Section>

          <Section title="Payment Schedules">
            {schedules.length === 0 ? (
              <p className="rounded-xl border border-border bg-surface-soft/50 px-4 py-6 text-center text-sm text-text-muted">
                No payment schedules linked to this purchase.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="min-w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-soft/80">
                      {["ID", "Amount", "Status", "Due"].map((col) => (
                        <th
                          key={col}
                          className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr
                        key={schedule.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-3 py-2.5 text-sm text-text-primary">
                          #{schedule.id}
                        </td>
                        <td className="px-3 py-2.5 text-sm text-text-secondary">
                          {formatMoney(
                            schedule.amount ?? schedule.total_amount,
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-sm capitalize text-text-secondary">
                          {schedule.status || "—"}
                        </td>
                        <td className="px-3 py-2.5 text-sm text-text-secondary">
                          {formatDate(
                            schedule.due_date ?? schedule.payment_date,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </div>
      ) : null}
    </Modal>
  );
};

export default MaterialPurchaseDetailsModal;
