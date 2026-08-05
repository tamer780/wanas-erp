import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import Button from "../../components/ui/Button";
import UnitSaleStatusBadge from "../../components/unit-sales/UnitSaleStatusBadge";
import InstallmentsTable from "../../components/unit-sales/InstallmentsTable";
import PaymentsTable from "../../components/unit-sales/PaymentsTable";
import RecordPaymentModal from "../../components/unit-sales/RecordPaymentModal";
import DeleteUnitSaleDialog from "../../components/unit-sales/DeleteUnitSaleDialog";
import UnitSalesErrorState from "../../components/unit-sales/UnitSalesErrorState";
import { useToast } from "../../context/ToastContext";
import { unitSalesService } from "../../services";
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

const UnitSaleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentInitial, setPaymentInitial] = useState(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [openingContract, setOpeningContract] = useState(false);

  const fetchSale = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const response = await unitSalesService.getById(id);
      const payload = response?.data?.data ?? response?.data;
      if (!payload) throw new Error("Unit sale not found.");
      setSale(payload);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load unit sale.",
      );
      setSale(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSale();
  }, [fetchSale]);

  const remaining = useMemo(() => {
    if (!sale) return 0;
    return Math.max(
      toNumber(sale.total_price) - toNumber(sale.paid_amount),
      0,
    );
  }, [sale]);

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
    setPaymentSubmitting(true);
    try {
      await unitSalesService.createPayment(id, payload);
      toast.success("Payment recorded successfully.");
      setPaymentOpen(false);
      setPaymentInitial(null);
      await fetchSale();
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await unitSalesService.remove(id);
      toast.success("Unit sale deleted successfully.");
      navigate("/unit-sales");
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete unit sale.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const openContractPdf = async () => {
    if (!sale) return;

    // Prefer authenticated blob fetch; fall back to direct URL.
    setOpeningContract(true);
    try {
      const response = await unitSalesService.getContract(sale.id);
      const blob = response?.data;
      if (blob instanceof Blob) {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
        return;
      }
    } catch {
      if (sale.contract_pdf_url) {
        window.open(sale.contract_pdf_url, "_blank", "noopener,noreferrer");
        return;
      }
      toast.error("Unable to open contract PDF.");
    } finally {
      setOpeningContract(false);
    }
  };

  const unit = sale?.unit;
  const client = sale?.client;
  const plan = sale?.installment_plan;
  const building = unit?.building;

  return (
    <PageScaffold
      title={sale?.contract_number || "Unit Sale Details"}
      description="Contract overview, installments, and payment history."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Unit Sales", to: "/unit-sales" },
        { label: sale?.contract_number || "Details" },
      ]}
      actions={
        sale ? (
          <div className="flex flex-wrap items-center gap-2">
            {(sale.contract_pdf || sale.contract_pdf_url) && (
              <Button
                type="button"
                variant="outline"
                size="md"
                loading={openingContract}
                onClick={openContractPdf}
              >
                <FileText className="size-4" aria-hidden="true" />
                Contract PDF
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </Button>
            <Button
              type="button"
              size="md"
              onClick={() => navigate(`/unit-sales/${id}/edit`)}
            >
              <Pencil className="size-4" aria-hidden="true" />
              Edit
            </Button>
          </div>
        ) : null
      }
    >
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <UnitSalesErrorState message={error} onRetry={fetchSale} />
      ) : null}

      {!loading && !error && sale ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <UnitSaleStatusBadge status={sale.status} />
              <span className="rounded-lg bg-surface-soft px-2.5 py-1 text-xs font-semibold capitalize text-text-secondary">
                {sale.sale_type || "—"}
              </span>
            </div>

            <Section title="Sale Overview">
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Contract Number"
                  value={sale.contract_number || "—"}
                />
                <DetailItem
                  label="Contract Date"
                  value={formatDate(sale.contract_date)}
                />
                <DetailItem
                  label="Total Price"
                  value={formatMoney(sale.total_price)}
                />
                <DetailItem
                  label="Down Payment"
                  value={formatMoney(sale.down_payment)}
                />
                <DetailItem
                  label="Paid Amount"
                  value={formatMoney(sale.paid_amount)}
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
                <DetailItem label="Client Phone" value={client?.phone || "—"} />
                <DetailItem label="Client Email" value={client?.email || "—"} />
                <DetailItem
                  label="English Notes"
                  value={normalizeNotesText(sale.notes, "en")}
                />
                <DetailItem
                  label="Arabic Notes"
                  value={normalizeNotesText(sale.notes, "ar")}
                />
                <DetailItem
                  label="Created At"
                  value={formatDate(sale.created_at)}
                />
                <DetailItem
                  label="Updated At"
                  value={formatDate(sale.updated_at)}
                />
              </dl>
            </Section>
          </div>

          {plan ? (
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
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
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <Section
              title="Installments"
              actions={
                <Button
                  type="button"
                  size="md"
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
                installments={sale.installments || []}
                onPay={handlePayInstallment}
              />
            </Section>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <Section
              title="Payments"
              actions={
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() =>
                    openRecordPayment({
                      payment_type: "down_payment",
                      installment_id: "",
                      amount: String(sale.down_payment || ""),
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
              <PaymentsTable payments={sale.payments || []} />
            </Section>
          </div>

          <div className="text-sm text-text-muted">
            <Link to="/unit-sales" className="text-wanas-700 hover:underline">
              ← Back to unit sales
            </Link>
          </div>
        </div>
      ) : null}

      <RecordPaymentModal
        open={paymentOpen}
        saleId={id}
        installments={sale?.installments || []}
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

      <DeleteUnitSaleDialog
        open={deleteOpen}
        sale={sale}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default UnitSaleDetails;
