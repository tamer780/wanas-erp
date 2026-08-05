import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import { suppliersService } from "../../services";
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

const SupplierDetailsModal = ({
  open,
  supplier,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [detail, setDetail] = useState(supplier);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !supplier?.id) return undefined;

    let cancelled = false;

    const load = async () => {
      setDetail(supplier);
      setLoading(true);
      setError("");
      try {
        const response = await suppliersService.getById(supplier.id);
        const payload = response?.data?.data ?? response?.data ?? null;
        if (!cancelled) setDetail(payload || supplier);
      } catch (err) {
        if (!cancelled) {
          setDetail(supplier);
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load full supplier details.",
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
  }, [open, supplier]);

  const activeSupplier = detail || supplier;
  const purchases = detail?.material_purchases || [];
  const payments = detail?.payments || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="Supplier Details"
      description="Profile, material purchases, and payments."
      footer={
        <>
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={!activeSupplier}
            onClick={() => onDelete?.(activeSupplier)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
          <Button
            type="button"
            size="md"
            disabled={!activeSupplier}
            onClick={() => onEdit?.(activeSupplier)}
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

          <Section title="Material Purchases">
            {purchases.length === 0 ? (
              <p className="rounded-xl border border-border bg-surface-soft/50 px-4 py-6 text-center text-sm text-text-muted">
                No material purchases linked to this supplier.
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
                      {purchases.map((purchase) => (
                        <tr
                          key={purchase.id}
                          className="border-b border-border last:border-b-0"
                        >
                          <td className="px-3 py-2.5 text-sm text-text-primary">
                            #{purchase.id}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-text-secondary">
                            {formatMoney(
                              purchase.total_amount ??
                                purchase.amount ??
                                purchase.total_cost,
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-sm capitalize text-text-secondary">
                            {purchase.status || "—"}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-text-secondary">
                            {formatDate(
                              purchase.purchase_date ??
                                purchase.created_at ??
                                purchase.date,
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

          <Section title="Payments">
            {payments.length === 0 ? (
              <p className="rounded-xl border border-border bg-surface-soft/50 px-4 py-6 text-center text-sm text-text-muted">
                No payments recorded for this supplier.
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

export default SupplierDetailsModal;
