import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import { landsService } from "../../services";
import {
  formatArea,
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

const LandDetailsModal = ({ open, land, onClose, onEdit, onDelete }) => {
  const [detail, setDetail] = useState(land);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !land?.id) return undefined;

    let cancelled = false;

    const needsFetch =
      !Array.isArray(land.buildings) || !Array.isArray(land.costs);

    if (!needsFetch) {
      setDetail(land);
      setError("");
      setLoading(false);
      return undefined;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await landsService.getById(land.id);
        const payload = response?.data?.data ?? response?.data ?? null;
        if (!cancelled) setDetail(payload || land);
      } catch (err) {
        if (!cancelled) {
          setDetail(land);
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load full land details.",
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
  }, [open, land]);

  const buildings = detail?.buildings ?? [];
  const costs = detail?.costs ?? [];

  const additionalCosts = useMemo(
    () =>
      (detail?.costs ?? []).reduce(
        (sum, cost) => sum + toNumber(cost.amount),
        0,
      ),
    [detail],
  );

  const totalInvestment = useMemo(() => {
    if (!detail) return 0;
    return (
      toNumber(detail.purchase_price) +
      toNumber(detail.fees) +
      toNumber(detail.taxes) +
      additionalCosts
    );
  }, [detail, additionalCosts]);

  const activeLand = detail || land;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="Land Details"
      description="General, financial, buildings, and cost information."
      footer={
        <>
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={!activeLand}
            onClick={() => onDelete?.(activeLand)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
          <Button
            type="button"
            size="md"
            disabled={!activeLand}
            onClick={() => onEdit?.(activeLand)}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Button>
        </>
      }
    >
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
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
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem label="Code" value={detail.code || "—"} />
              <DetailItem
                label="Arabic Name"
                value={translationText(detail.name, "ar")}
              />
              <DetailItem
                label="English Name"
                value={translationText(detail.name, "en")}
              />
              <DetailItem label="Location" value={detail.location || "—"} />
              <DetailItem label="City" value={detail.city || "—"} />
              <DetailItem label="Area" value={formatArea(detail.area_sqm)} />
              <DetailItem
                label="Purchase Date"
                value={formatDate(detail.purchase_date)}
              />
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Status
                </dt>
                <dd>
                  <StatusBadge status={detail.status} />
                </dd>
              </div>
            </dl>
          </Section>

          <Section title="Financial Information">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem
                label="Purchase Price"
                value={formatMoney(detail.purchase_price)}
              />
              <DetailItem label="Fees" value={formatMoney(detail.fees)} />
              <DetailItem label="Taxes" value={formatMoney(detail.taxes)} />
              <DetailItem
                label="Additional Costs"
                value={formatMoney(additionalCosts)}
              />
              <DetailItem
                label="Total Investment"
                value={formatMoney(totalInvestment)}
              />
            </dl>
          </Section>

          <Section title="Buildings">
            {buildings.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No buildings linked to this land.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-surface-soft text-xs uppercase tracking-wide text-text-muted">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Code</th>
                        <th className="px-3 py-2 font-semibold">Name</th>
                        <th className="px-3 py-2 font-semibold">Floors</th>
                        <th className="px-3 py-2 font-semibold">Area</th>
                        <th className="px-3 py-2 font-semibold">
                          Construction Cost
                        </th>
                        <th className="px-3 py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buildings.map((building) => (
                        <tr
                          key={building.id}
                          className="border-t border-border"
                        >
                          <td className="px-3 py-2.5">{building.code || "—"}</td>
                          <td className="px-3 py-2.5">
                            {translationText(building.name, "en")}
                          </td>
                          <td className="px-3 py-2.5">
                            {building.floors ?? "—"}
                          </td>
                          <td className="px-3 py-2.5">
                            {formatArea(building.area_sqm)}
                          </td>
                          <td className="px-3 py-2.5">
                            {formatMoney(building.construction_cost)}
                          </td>
                          <td className="px-3 py-2.5">
                            <StatusBadge status={building.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Section>

          <Section title="Costs">
            {costs.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No additional costs recorded.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-surface-soft text-xs uppercase tracking-wide text-text-muted">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Category</th>
                        <th className="px-3 py-2 font-semibold">Title</th>
                        <th className="px-3 py-2 font-semibold">Amount</th>
                        <th className="px-3 py-2 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costs.map((cost) => (
                        <tr key={cost.id} className="border-t border-border">
                          <td className="px-3 py-2.5 capitalize">
                            {cost.category || "—"}
                          </td>
                          <td className="px-3 py-2.5">
                            {translationText(cost.title, "en")}
                          </td>
                          <td className="px-3 py-2.5">
                            {formatMoney(cost.amount)}
                          </td>
                          <td className="px-3 py-2.5">
                            {formatDate(cost.cost_date)}
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

export default LandDetailsModal;
