import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import UnitSaleStatusBadge from "./UnitSaleStatusBadge";
import InstallmentsTable from "./InstallmentsTable";
import PaymentsTable from "./PaymentsTable";
import RecordPaymentModal from "./RecordPaymentModal";
import { unitSalesService } from "../../services";
import { useToast } from "../../context/ToastContext";
import {
  formatDate,
  formatMoney,
  toNumber,
  translationText,
} from "../../utils/format";
import { normalizeNotesText } from "../../utils/unitSaleValidation";

const DetailItem = ({ label, value }) => (
  <div className="space-y-1">
    <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
      {label}
    </dt>
    <dd className="text-sm font-medium text-text-primary">{value}</dd>
  </div>
);

const Section = ({ title, actions, children }) => (
  <section className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {actions}
    </div>
    {children}
  </section>
);

const UnitSaleDetailsModal = ({
  open,
  sale,
  onClose,
  onEdit,
  onDelete,
  onChanged,
}) => {
  const toast = useToast();
  const [detail, setDetail] = useState(sale);
  const [loading, setLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [openingContract, setOpeningContract] = useState(false);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentInitial, setPaymentInitial] = useState(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const fetchDetail = useCallback(async (item) => {
    if (!item?.id) return;
    setLoading(true);
    setDetailError("");
    setDetail(item);
    try {
      const response = await unitSalesService.getById(item.id);
      const payload = response?.data?.data ?? response?.data ?? null;
      setDetail(payload || item);
    } catch (err) {
      setDetail(item);
      setDetailError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load full unit sale details.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open || !sale?.id) return undefined;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setDetailError("");
      setDetail(sale);
      try {
        const response = await unitSalesService.getById(sale.id);
        const payload = response?.data?.data ?? response?.data ?? null;
        if (!cancelled) setDetail(payload || sale);
      } catch (err) {
        if (!cancelled) {
          setDetail(sale);
          setDetailError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load full unit sale details.",
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
  }, [open, sale]);

  const active = detail || sale;
  const unit = active?.unit;
  const client = active?.client;
  const plan = active?.installment_plan;
  const building = unit?.building;

  const remaining = useMemo(() => {
    if (!active) return 0;
    return Math.max(
      toNumber(active.total_price) - toNumber(active.paid_amount),
      0,
    );
  }, [active]);

  const openRecordPayment = (defaults = null) => {
    setPaymentInitial(defaults);
    setPaymentOpen(true);
  };

  const handlePayInstallment = (installment) => {
    const remainingAmount = Math.max(
      toNumber(installment.amount) - toNumber(installment.paid_amount),
      0,
    );
    openRecordPayment({
      payment_type: "installment",
      installment_id: String(installment.id),
      amount: String(remainingAmount || installment.amount || ""),
      payment_method: "Cash",
      receipt_number: "",
      paid_at: new Date().toISOString().slice(0, 10),
      notes: "",
    });
  };

  const handlePaymentSubmit = async (payload) => {
    if (!active?.id) return;
    setPaymentSubmitting(true);
    try {
      await unitSalesService.createPayment(active.id, payload);
      toast.success("Payment recorded successfully.");
      setPaymentOpen(false);
      setPaymentInitial(null);
      await fetchDetail(active);
      onChanged?.();
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const openContractPdf = async () => {
    if (!active) return;

    setOpeningContract(true);
    try {
      const response = await unitSalesService.getContract(active.id);
      const blob = response?.data;
      if (blob instanceof Blob) {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
        return;
      }
    } catch {
      if (active.contract_pdf_url) {
        window.open(active.contract_pdf_url, "_blank", "noopener,noreferrer");
        return;
      }
      toast.error("Unable to open contract PDF.");
    } finally {
      setOpeningContract(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        size="xl"
        title={active?.contract_number || "Unit Sale Details"}
        description="Contract overview, installments, and payment history."
        footer={
          <>
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Close
            </Button>
            {(active?.contract_pdf || active?.contract_pdf_url) && (
              <Button
                type="button"
                variant="outline"
                size="md"
                loading={openingContract}
                disabled={!active}
                onClick={openContractPdf}
              >
                <FileText className="size-4" aria-hidden="true" />
                Contract PDF
              </Button>
            )}
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
            <div className="flex flex-wrap items-center gap-3">
              <UnitSaleStatusBadge status={active.status} />
              <span className="rounded-lg bg-surface-soft px-2.5 py-1 text-xs font-semibold capitalize text-text-secondary">
                {active.sale_type || "—"}
              </span>
            </div>

            <Section title="Sale Overview">
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Contract Number"
                  value={active.contract_number || "—"}
                />
                <DetailItem
                  label="Contract Date"
                  value={formatDate(active.contract_date)}
                />
                <DetailItem
                  label="Total Price"
                  value={formatMoney(active.total_price)}
                />
                <DetailItem
                  label="Down Payment"
                  value={formatMoney(active.down_payment)}
                />
                <DetailItem
                  label="Paid Amount"
                  value={formatMoney(active.paid_amount)}
                />
                <DetailItem label="Remaining" value={formatMoney(remaining)} />
                <DetailItem
                  label="Unit"
                  value={
                    translationText(unit?.name, "en") !== "—"
                      ? translationText(unit?.name, "en")
                      : unit?.code || "—"
                  }
                />
                <DetailItem label="Unit Code" value={unit?.code || "—"} />
                <DetailItem
                  label="Building"
                  value={
                    translationText(building?.name, "en") !== "—"
                      ? translationText(building?.name, "en")
                      : building?.code || "—"
                  }
                />
                <DetailItem
                  label="Client"
                  value={
                    translationText(client?.name, "en") !== "—"
                      ? translationText(client?.name, "en")
                      : "—"
                  }
                />
                <DetailItem
                  label="Client Phone"
                  value={client?.phone || "—"}
                />
                <DetailItem
                  label="Client Email"
                  value={client?.email || "—"}
                />
                <DetailItem
                  label="English Notes"
                  value={normalizeNotesText(active.notes, "en")}
                />
                <DetailItem
                  label="Arabic Notes"
                  value={normalizeNotesText(active.notes, "ar")}
                />
                <DetailItem
                  label="Created At"
                  value={formatDate(active.created_at)}
                />
                <DetailItem
                  label="Updated At"
                  value={formatDate(active.updated_at)}
                />
              </dl>
            </Section>

            {plan ? (
              <Section title="Installment Plan">
                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <DetailItem label="Months" value={plan.months ?? "—"} />
                  <DetailItem
                    label="Monthly Amount"
                    value={formatMoney(plan.monthly_amount)}
                  />
                  <DetailItem
                    label="Start Date"
                    value={formatDate(plan.start_date)}
                  />
                  <DetailItem
                    label="Residual Amount"
                    value={formatMoney(plan.residual_amount)}
                  />
                </dl>
              </Section>
            ) : null}

            <Section
              title="Installments"
              actions={
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    openRecordPayment({
                      payment_type: "installment",
                      installment_id: "",
                      amount: "",
                      payment_method: "Cash",
                      receipt_number: "",
                      paid_at: new Date().toISOString().slice(0, 10),
                      notes: "",
                    })
                  }
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Record Payment
                </Button>
              }
            >
              <InstallmentsTable
                installments={active.installments || []}
                onPay={handlePayInstallment}
              />
            </Section>

            <Section
              title="Payments"
              actions={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    openRecordPayment({
                      payment_type: "down_payment",
                      installment_id: "",
                      amount: String(active.down_payment || ""),
                      payment_method: "Bank Transfer",
                      receipt_number: "",
                      paid_at: new Date().toISOString().slice(0, 10),
                      notes: "",
                    })
                  }
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Down Payment
                </Button>
              }
            >
              <PaymentsTable payments={active.payments || []} />
            </Section>
          </div>
        ) : null}
      </Modal>

      <RecordPaymentModal
        open={paymentOpen}
        saleId={active?.id}
        installments={active?.installments || []}
        initialValues={paymentInitial}
        submitting={paymentSubmitting}
        onClose={() => {
          if (!paymentSubmitting) {
            setPaymentOpen(false);
            setPaymentInitial(null);
          }
        }}
        onSubmit={handlePaymentSubmit}
      />
    </>
  );
};

export default UnitSaleDetailsModal;
