import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import UnitCostsCard from "./UnitCostsCard";
import { unitsService } from "../../services";
import {
  formatArea,
  formatDate,
  formatMoney,
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

const UnitDetailsModal = ({ open, unit, onClose, onEdit, onDelete }) => {
  const [detail, setDetail] = useState(unit);
  const [costs, setCosts] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingCosts, setLoadingCosts] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [costsError, setCostsError] = useState("");

  useEffect(() => {
    if (!open || !unit?.id) return undefined;

    let cancelled = false;

    const needsFetch = !unit.building && !unit.land;

    if (!needsFetch) {
      setDetail(unit);
      setDetailError("");
      setLoadingDetail(false);
    } else {
      const loadDetail = async () => {
        setLoadingDetail(true);
        setDetailError("");
        try {
          const response = await unitsService.getById(unit.id);
          const payload = response?.data?.data ?? response?.data ?? null;
          if (!cancelled) setDetail(payload || unit);
        } catch (err) {
          if (!cancelled) {
            setDetail(unit);
            setDetailError(
              err?.response?.data?.message ||
                err?.message ||
                "Failed to load full unit details.",
            );
          }
        } finally {
          if (!cancelled) setLoadingDetail(false);
        }
      };

      loadDetail();
    }

    const loadCosts = async () => {
      setLoadingCosts(true);
      setCostsError("");
      setCosts(null);
      try {
        const response = await unitsService.getCosts(unit.id);
        const payload = response?.data?.data ?? response?.data ?? null;
        if (!cancelled) setCosts(payload);
      } catch (err) {
        if (!cancelled) {
          setCosts(null);
          setCostsError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load unit costs.",
          );
        }
      } finally {
        if (!cancelled) setLoadingCosts(false);
      }
    };

    loadCosts();

    return () => {
      cancelled = true;
    };
  }, [open, unit]);

  const activeUnit = detail || unit;
  const building = detail?.building;
  const land = detail?.land;
  const loading = loadingDetail;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="Unit Details"
      description="General information and cost summary."
      footer={
        <>
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={!activeUnit}
            onClick={() => onDelete?.(activeUnit)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
          <Button
            type="button"
            size="md"
            disabled={!activeUnit}
            onClick={() => onEdit?.(activeUnit)}
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

      {!loading && detailError ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700"
        >
          {detailError}
        </div>
      ) : null}

      {!loading && detail ? (
        <div className="space-y-6">
          <Section title="General Information">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem
                label="English Name"
                value={translationText(detail.name, "en")}
              />
              <DetailItem
                label="Arabic Name"
                value={translationText(detail.name, "ar")}
              />
              <DetailItem label="Unit Code" value={detail.code || "—"} />
              <DetailItem
                label="Building"
                value={
                  translationText(building?.name, "en") !== "—"
                    ? translationText(building?.name, "en")
                    : building?.code || "—"
                }
              />
              <DetailItem
                label="Building Code"
                value={building?.code || "—"}
              />
              <DetailItem
                label="Land"
                value={
                  translationText(land?.name, "en") !== "—"
                    ? translationText(land?.name, "en")
                    : land?.code || "—"
                }
              />
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Status
                </dt>
                <dd>
                  <StatusBadge status={detail.status} />
                </dd>
              </div>
              <DetailItem label="Unit Type" value={detail.unit_type || "—"} />
              <DetailItem label="Floor" value={detail.floor ?? "—"} />
              <DetailItem label="Area" value={formatArea(detail.area_sqm)} />
              <DetailItem
                label="Base Cost"
                value={formatMoney(detail.base_cost)}
              />
              <DetailItem
                label="Sale Price"
                value={formatMoney(detail.sale_price)}
              />
              <DetailItem
                label="English Notes"
                value={translationText(detail.notes, "en")}
              />
              <DetailItem
                label="Arabic Notes"
                value={translationText(detail.notes, "ar")}
              />
              <DetailItem
                label="Created At"
                value={formatDate(detail.created_at)}
              />
              <DetailItem
                label="Updated At"
                value={formatDate(detail.updated_at)}
              />
            </dl>
          </Section>

          <Section title="Cost Summary">
            <UnitCostsCard
              costs={costs}
              loading={loadingCosts}
              error={costsError}
            />
          </Section>
        </div>
      ) : null}
    </Modal>
  );
};

export default UnitDetailsModal;
