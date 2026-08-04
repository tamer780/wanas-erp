import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import BuildingCostsCard from "./BuildingCostsCard";
import UnitsTable from "./UnitsTable";
import { buildingsService } from "../../services";
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

const BuildingDetailsModal = ({
  open,
  building,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [detail, setDetail] = useState(building);
  const [costs, setCosts] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingCosts, setLoadingCosts] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [costsError, setCostsError] = useState("");

  useEffect(() => {
    if (!open || !building?.id) return undefined;

    let cancelled = false;

    const needsFetch = !Array.isArray(building.units);

    if (!needsFetch) {
      setDetail(building);
      setDetailError("");
      setLoadingDetail(false);
    } else {
      const loadDetail = async () => {
        setLoadingDetail(true);
        setDetailError("");
        try {
          const response = await buildingsService.getById(building.id);
          const payload = response?.data?.data ?? response?.data ?? null;
          if (!cancelled) setDetail(payload || building);
        } catch (err) {
          if (!cancelled) {
            setDetail(building);
            setDetailError(
              err?.response?.data?.message ||
                err?.message ||
                "Failed to load full building details.",
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
        const response = await buildingsService.getCosts(building.id);
        const payload = response?.data?.data ?? response?.data ?? null;
        if (!cancelled) setCosts(payload);
      } catch (err) {
        if (!cancelled) {
          setCosts(null);
          setCostsError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load building costs.",
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
  }, [open, building]);

  const activeBuilding = detail || building;
  const units = detail?.units ?? [];
  const land = detail?.land;
  const loading = loadingDetail;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="Building Details"
      description="General information, financial summary, and units."
      footer={
        <>
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={!activeBuilding}
            onClick={() => onDelete?.(activeBuilding)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
          <Button
            type="button"
            size="md"
            disabled={!activeBuilding}
            onClick={() => onEdit?.(activeBuilding)}
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
              <DetailItem label="Building Code" value={detail.code || "—"} />
              <DetailItem
                label="Land"
                value={translationText(land?.name, "en")}
              />
              <DetailItem label="City" value={land?.city || "—"} />
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Status
                </dt>
                <dd>
                  <StatusBadge status={detail.status} />
                </dd>
              </div>
              <DetailItem label="Floors" value={detail.floors ?? "—"} />
              <DetailItem label="Area" value={formatArea(detail.area_sqm)} />
              <DetailItem
                label="Start Date"
                value={formatDate(detail.start_date)}
              />
              <DetailItem
                label="Completion Date"
                value={formatDate(detail.completion_date)}
              />
              <DetailItem
                label="Construction Cost"
                value={formatMoney(detail.construction_cost)}
              />
              <DetailItem
                label="Other Costs"
                value={formatMoney(detail.other_costs)}
              />
            </dl>
          </Section>

          <Section title="Financial Summary">
            <BuildingCostsCard
              costs={costs}
              loading={loadingCosts}
              error={costsError}
            />
          </Section>

          <Section title="Units">
            <UnitsTable units={units} />
          </Section>
        </div>
      ) : null}
    </Modal>
  );
};

export default BuildingDetailsModal;
