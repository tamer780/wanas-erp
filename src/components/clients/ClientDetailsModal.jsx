import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import { clientsService } from "../../services";
import { formatDate, translationText } from "../../utils/format";

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

const ClientDetailsModal = ({ open, client, onClose, onEdit, onDelete }) => {
  const [detail, setDetail] = useState(client);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !client?.id) return undefined;

    let cancelled = false;

    const load = async () => {
      setDetail(client);
      setLoading(true);
      setError("");
      try {
        const response = await clientsService.getById(client.id);
        const payload = response?.data?.data ?? response?.data ?? null;
        if (!cancelled) setDetail(payload || client);
      } catch (err) {
        if (!cancelled) {
          setDetail(client);
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load full client details.",
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
  }, [open, client]);

  const activeClient = detail || client;
  const taxId = detail?.tax_id ?? detail?.national_id;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Client Details"
      description="Profile, contact, and identity information."
      footer={
        <>
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={!activeClient}
            onClick={() => onDelete?.(activeClient)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
          <Button
            type="button"
            size="md"
            disabled={!activeClient}
            onClick={() => onEdit?.(activeClient)}
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
              <DetailItem
                label="Address"
                value={detail.address || "—"}
              />
              <DetailItem label="Tax ID" value={taxId || "—"} />
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
        </div>
      ) : null}
    </Modal>
  );
};

export default ClientDetailsModal;
