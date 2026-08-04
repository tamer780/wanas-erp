import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DoorOpen, Plus } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import UnitSummaryCards from "../../components/units/UnitSummaryCards";
import UnitsToolbar from "../../components/units/UnitsToolbar";
import UnitTable from "../../components/units/UnitTable";
import UnitFormModal from "../../components/units/UnitFormModal";
import UnitDetailsModal from "../../components/units/UnitDetailsModal";
import DeleteUnitDialog from "../../components/units/DeleteUnitDialog";
import UnitsLoadingSkeleton from "../../components/units/UnitsLoadingSkeleton";
import UnitsErrorState from "../../components/units/UnitsErrorState";
import { useToast } from "../../context/ToastContext";
import { buildingsService, unitsService } from "../../services";
import { toNumber, translationText } from "../../utils/format";
import { transitionModals } from "../../utils/modalTransition";

const extractPaginatedList = (response) => {
  const body = response?.data;
  const paginated = body?.data ?? body;
  const list = Array.isArray(paginated?.data)
    ? paginated.data
    : Array.isArray(paginated)
      ? paginated
      : [];

  return {
    items: list,
    total: paginated?.total ?? list.length,
    currentPage: paginated?.current_page ?? 1,
    lastPage: paginated?.last_page ?? 1,
  };
};

const Units = () => {
  const toast = useToast();
  const entrancePlayed = useRef(false);

  const [units, setUnits] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const [buildingOptions, setBuildingOptions] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [buildingId, setBuildingId] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingUnit, setEditingUnit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUnit, setDeletingUnit] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUnits = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await unitsService.getAll({ page });
      const payload = extractPaginatedList(response);
      setUnits(payload.items);
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
          "Failed to load units.",
      );
      setUnits([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchBuildingOptions = useCallback(async () => {
    try {
      const response = await buildingsService.getAll();
      const payload = extractPaginatedList(response);
      setBuildingOptions(payload.items);
    } catch {
      setBuildingOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchUnits(1);
    fetchBuildingOptions();
  }, [fetchUnits, fetchBuildingOptions]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const filterBuildings = useMemo(() => {
    const map = new Map();

    units.forEach((unit) => {
      const building = unit.building;
      const id = building?.id ?? unit.building_id;
      if (!id || map.has(String(id))) return;
      map.set(String(id), building || { id, name: null, code: null });
    });

    return Array.from(map.values()).sort((a, b) =>
      String(translationText(a.name, "en")).localeCompare(
        String(translationText(b.name, "en")),
      ),
    );
  }, [units]);

  const filteredUnits = useMemo(() => {
    const query = search.trim().toLowerCase();

    return units.filter((unit) => {
      if (status && String(unit.status).toLowerCase() !== status) {
        return false;
      }

      const unitBuildingId = String(unit.building_id ?? unit.building?.id ?? "");
      if (buildingId && unitBuildingId !== String(buildingId)) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        unit.code,
        translationText(unit.name, "en"),
        translationText(unit.name, "ar"),
        unit.unit_type,
        translationText(unit.building?.name, "en"),
        translationText(unit.building?.name, "ar"),
        unit.building?.code,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [units, search, status, buildingId]);

  const summary = useMemo(() => {
    return filteredUnits.reduce(
      (result, unit) => {
        result.totalUnits += 1;
        result.totalArea += toNumber(unit.area_sqm);
        result.totalBaseCost += toNumber(unit.base_cost);
        result.totalSalePrice += toNumber(unit.sale_price);

        const key = String(unit.status || "").toLowerCase();
        if (key === "available") result.availableUnits += 1;
        if (key === "reserved") result.reservedUnits += 1;
        if (key === "sold") result.soldUnits += 1;

        return result;
      },
      {
        totalUnits: 0,
        totalArea: 0,
        totalBaseCost: 0,
        totalSalePrice: 0,
        availableUnits: 0,
        reservedUnits: 0,
        soldUnits: 0,
      },
    );
  }, [filteredUnits]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setBuildingId("");
  };

  const openCreate = () => {
    setFormMode("create");
    setEditingUnit(null);
    setFormOpen(true);
  };

  const openEdit = (unit) => {
    setFormMode("edit");
    setEditingUnit(unit);
    setFormOpen(true);
  };

  const openDetails = (unit) => {
    setSelectedUnit(unit);
    setDetailsOpen(true);
  };

  const openDelete = (unit) => {
    setDeletingUnit(unit);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (formMode === "edit" && editingUnit?.id) {
        await unitsService.update(editingUnit.id, payload);
        toast.success("Unit updated successfully.");
      } else {
        await unitsService.create(payload);
        toast.success("Unit created successfully.");
      }
      setFormOpen(false);
      setEditingUnit(null);
      await fetchUnits(currentPage, { soft: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUnit?.id) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await unitsService.remove(deletingUnit.id);
      setDeleteOpen(false);
      setDeletingUnit(null);
      toast.success("Unit deleted successfully.");
      await fetchUnits(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete unit.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const showEmpty =
    !loading && !error && filteredUnits.length === 0 && units.length === 0;
  const showFilteredEmpty =
    !loading && !error && filteredUnits.length === 0 && units.length > 0;

  return (
    <PageScaffold
      title="Units Management"
      description="Manage residential and commercial units across buildings."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Units" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New Unit
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <UnitsLoadingSkeleton /> : null}

        {!loading && error ? (
          <UnitsErrorState message={error} onRetry={() => fetchUnits(1)} />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <UnitSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <UnitsToolbar
              search={search}
              status={status}
              buildingId={buildingId}
              buildings={filterBuildings}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onBuildingChange={setBuildingId}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={DoorOpen}
                  title="No Units Found"
                  description="Create your first unit."
                  actionLabel="New Unit"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={DoorOpen}
                  title="No matching units"
                  description="Try adjusting search or filters, or reset to see all units."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <UnitTable
                  units={filteredUnits}
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
                          fetchUnits(currentPage - 1, { soft: true })
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
                          fetchUnits(currentPage + 1, { soft: true })
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

      <UnitFormModal
        open={formOpen}
        mode={formMode}
        unit={editingUnit}
        buildingOptions={buildingOptions}
        submitting={submitting}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditingUnit(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <UnitDetailsModal
        open={detailsOpen}
        unit={selectedUnit}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedUnit(null);
        }}
        onEdit={(unit) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedUnit(null);
            },
            () => openEdit(unit),
          );
        }}
        onDelete={(unit) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedUnit(null);
            },
            () => openDelete(unit),
          );
        }}
      />

      <DeleteUnitDialog
        open={deleteOpen}
        unit={deletingUnit}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeletingUnit(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default Units;
