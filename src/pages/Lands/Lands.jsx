import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Map, Plus } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import LandSummaryCards from "../../components/lands/LandSummaryCards";
import LandsToolbar from "../../components/lands/LandsToolbar";
import LandTable from "../../components/lands/LandTable";
import LandFormModal from "../../components/lands/LandFormModal";
import LandDetailsModal from "../../components/lands/LandDetailsModal";
import DeleteLandDialog from "../../components/lands/DeleteLandDialog";
import LandsLoadingSkeleton from "../../components/lands/LandsLoadingSkeleton";
import LandsErrorState from "../../components/lands/LandsErrorState";
import { useToast } from "../../context/ToastContext";
import { landsService } from "../../services";
import { toNumber, translationText } from "../../utils/format";
import { transitionModals } from "../../utils/modalTransition";

const extractLandsPayload = (response) => {
  const body = response?.data;
  const paginated = body?.data ?? body;
  const list = Array.isArray(paginated?.data)
    ? paginated.data
    : Array.isArray(paginated)
      ? paginated
      : [];

  return {
    lands: list,
    total: paginated?.total ?? list.length,
    currentPage: paginated?.current_page ?? 1,
    lastPage: paginated?.last_page ?? 1,
  };
};

const Lands = () => {
  const toast = useToast();
  const entrancePlayed = useRef(false);

  const [lands, setLands] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingLand, setEditingLand] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingLand, setDeletingLand] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchLands = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await landsService.getAll({ page });
      const payload = extractLandsPayload(response);
      setLands(payload.lands);
      setTotal(payload.total);
      setCurrentPage(payload.currentPage);
      setLastPage(payload.lastPage);
      if (!soft && !entrancePlayed.current) {
        entrancePlayed.current = true;
        setAnimateEntrance(true);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load lands.",
      );
      setLands([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLands(1);
  }, [fetchLands]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const cities = useMemo(() => {
    const unique = new Set(
      lands.map((land) => land.city).filter((value) => Boolean(value)),
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [lands]);

  const filteredLands = useMemo(() => {
    const query = search.trim().toLowerCase();

    return lands.filter((land) => {
      if (status && String(land.status).toLowerCase() !== status) {
        return false;
      }

      if (city && land.city !== city) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        land.code,
        land.city,
        land.location,
        translationText(land.name, "en"),
        translationText(land.name, "ar"),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [lands, search, status, city]);

  const summary = useMemo(() => {
    return filteredLands.reduce(
      (acc, land) => {
        acc.totalLands += 1;
        acc.totalPurchasePrice += toNumber(land.purchase_price);
        acc.totalArea += toNumber(land.area_sqm);
        acc.totalBuildings += land.buildings?.length ?? 0;
        acc.totalAdditionalCosts += (land.costs ?? []).reduce(
          (sum, cost) => sum + toNumber(cost.amount),
          0,
        );
        return acc;
      },
      {
        totalLands: 0,
        totalPurchasePrice: 0,
        totalArea: 0,
        totalBuildings: 0,
        totalAdditionalCosts: 0,
      },
    );
  }, [filteredLands]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setCity("");
  };

  const openCreate = () => {
    setFormMode("create");
    setEditingLand(null);
    setFormOpen(true);
  };

  const openEdit = (land) => {
    setFormMode("edit");
    setEditingLand(land);
    setFormOpen(true);
  };

  const openDetails = (land) => {
    setSelectedLand(land);
    setDetailsOpen(true);
  };

  const openDelete = (land) => {
    setDeletingLand(land);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (formMode === "edit" && editingLand?.id) {
        await landsService.update(editingLand.id, payload);
        toast.success("Land updated successfully.");
      } else {
        await landsService.create(payload);
        toast.success("Land created successfully.");
      }
      setFormOpen(false);
      setEditingLand(null);
      await fetchLands(currentPage, { soft: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLand?.id) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await landsService.remove(deletingLand.id);
      setDeleteOpen(false);
      setDeletingLand(null);
      toast.success("Land deleted successfully.");
      await fetchLands(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete land.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const showEmpty =
    !loading && !error && filteredLands.length === 0 && lands.length === 0;
  const showFilteredEmpty =
    !loading && !error && filteredLands.length === 0 && lands.length > 0;

  return (
    <PageScaffold
      title="Lands Management"
      description="Manage land parcels, purchase details, buildings, and related costs."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Lands" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New Land
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <LandsLoadingSkeleton /> : null}

        {!loading && error ? (
          <LandsErrorState message={error} onRetry={() => fetchLands(1)} />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <LandSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <LandsToolbar
              search={search}
              status={status}
              city={city}
              cities={cities}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onCityChange={setCity}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Map}
                  title="No Lands Found"
                  description="Lands will appear here once they are created."
                  actionLabel="New Land"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Map}
                  title="No matching lands"
                  description="Try adjusting search or filters, or reset to see all lands."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <LandTable
                  lands={filteredLands}
                  onView={openDetails}
                  animateEntrance={animateEntrance}
                  refreshing={refreshing}
                />

                {lastPage > 1 ? (
                  <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-text-secondary">
                      Page {currentPage} of {lastPage} · {total} total
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={refreshing || currentPage <= 1}
                        onClick={() =>
                          fetchLands(currentPage - 1, { soft: true })
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={refreshing || currentPage >= lastPage}
                        onClick={() =>
                          fetchLands(currentPage + 1, { soft: true })
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <LandFormModal
        open={formOpen}
        mode={formMode}
        land={editingLand}
        submitting={submitting}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditingLand(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <LandDetailsModal
        open={detailsOpen}
        land={selectedLand}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedLand(null);
        }}
        onEdit={(land) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedLand(null);
            },
            () => openEdit(land),
          );
        }}
        onDelete={(land) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedLand(null);
            },
            () => openDelete(land),
          );
        }}
      />

      <DeleteLandDialog
        open={deleteOpen}
        land={deletingLand}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeletingLand(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default Lands;
