import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Building2, Plus } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import BuildingSummaryCards from "../../components/buildings/BuildingSummaryCards";
import BuildingToolbar from "../../components/buildings/BuildingToolbar";
import BuildingTable from "../../components/buildings/BuildingTable";
import BuildingFormModal from "../../components/buildings/BuildingFormModal";
import BuildingDetailsModal from "../../components/buildings/BuildingDetailsModal";
import DeleteBuildingDialog from "../../components/buildings/DeleteBuildingDialog";
import BuildingsLoadingSkeleton from "../../components/buildings/BuildingsLoadingSkeleton";
import BuildingsErrorState from "../../components/buildings/BuildingsErrorState";
import { useToast } from "../../context/ToastContext";
import { buildingsService, landsService } from "../../services";
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

const Buildings = () => {
  const toast = useToast();
  const entrancePlayed = useRef(false);

  const [buildings, setBuildings] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const [landOptions, setLandOptions] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [landId, setLandId] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingBuilding, setDeletingBuilding] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchBuildings = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await buildingsService.getAll({ page });
      const payload = extractPaginatedList(response);
      setBuildings(payload.items);
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
          "Failed to load buildings.",
      );
      setBuildings([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchLandOptions = useCallback(async () => {
    try {
      const response = await landsService.getAll();
      const payload = extractPaginatedList(response);
      setLandOptions(payload.items);
    } catch {
      setLandOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchBuildings(1);
    fetchLandOptions();
  }, [fetchBuildings, fetchLandOptions]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const filterLands = useMemo(() => {
    const map = new Map();

    buildings.forEach((building) => {
      const land = building.land;
      const id = land?.id ?? building.land_id;
      if (!id || map.has(String(id))) return;
      map.set(String(id), land || { id, name: null, code: null });
    });

    return Array.from(map.values()).sort((a, b) =>
      String(translationText(a.name, "en")).localeCompare(
        String(translationText(b.name, "en")),
      ),
    );
  }, [buildings]);

  const filteredBuildings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return buildings.filter((building) => {
      if (status && String(building.status).toLowerCase() !== status) {
        return false;
      }

      const buildingLandId = String(
        building.land_id ?? building.land?.id ?? "",
      );
      if (landId && buildingLandId !== String(landId)) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        building.code,
        translationText(building.name, "en"),
        translationText(building.name, "ar"),
        translationText(building.land?.name, "en"),
        translationText(building.land?.name, "ar"),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [buildings, search, status, landId]);

  const summary = useMemo(() => {
    const acc = filteredBuildings.reduce(
      (result, building) => {
        result.totalBuildings += 1;
        result.totalUnits += building.units?.length ?? 0;
        result.totalFloors += toNumber(building.floors);
        result.totalArea += toNumber(building.area_sqm);
        result.totalConstructionCost += toNumber(building.construction_cost);

        const key = String(building.status || "").toLowerCase();
        if (key === "planning") result.planningBuildings += 1;
        if (key === "active") result.activeBuildings += 1;
        if (key === "completed") result.completedBuildings += 1;

        return result;
      },
      {
        totalBuildings: 0,
        totalUnits: 0,
        totalFloors: 0,
        totalArea: 0,
        totalConstructionCost: 0,
        planningBuildings: 0,
        activeBuildings: 0,
        completedBuildings: 0,
      },
    );

    return {
      ...acc,
      averageFloors:
        acc.totalBuildings > 0 ? acc.totalFloors / acc.totalBuildings : 0,
    };
  }, [filteredBuildings]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setLandId("");
  };

  const openCreate = () => {
    setFormMode("create");
    setEditingBuilding(null);
    setFormOpen(true);
  };

  const openEdit = (building) => {
    setFormMode("edit");
    setEditingBuilding(building);
    setFormOpen(true);
  };

  const openDetails = (building) => {
    setSelectedBuilding(building);
    setDetailsOpen(true);
  };

  const openDelete = (building) => {
    setDeletingBuilding(building);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (formMode === "edit" && editingBuilding?.id) {
        await buildingsService.update(editingBuilding.id, payload);
        toast.success("Building updated successfully.");
      } else {
        await buildingsService.create(payload);
        toast.success("Building created successfully.");
      }
      setFormOpen(false);
      setEditingBuilding(null);
      await fetchBuildings(currentPage, { soft: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBuilding?.id) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await buildingsService.remove(deletingBuilding.id);
      setDeleteOpen(false);
      setDeletingBuilding(null);
      toast.success("Building deleted successfully.");
      await fetchBuildings(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete building.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const showEmpty =
    !loading &&
    !error &&
    filteredBuildings.length === 0 &&
    buildings.length === 0;
  const showFilteredEmpty =
    !loading &&
    !error &&
    filteredBuildings.length === 0 &&
    buildings.length > 0;

  return (
    <PageScaffold
      title="Buildings Management"
      description="Manage buildings that belong to land parcels, including construction details and units."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Buildings" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New Building
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <BuildingsLoadingSkeleton /> : null}

        {!loading && error ? (
          <BuildingsErrorState
            message={error}
            onRetry={() => fetchBuildings(1)}
          />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <BuildingSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <BuildingToolbar
              search={search}
              status={status}
              landId={landId}
              lands={filterLands}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onLandChange={setLandId}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Building2}
                  title="No Buildings Found"
                  description="Create your first building."
                  actionLabel="New Building"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Building2}
                  title="No matching buildings"
                  description="Try adjusting search or filters, or reset to see all buildings."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <BuildingTable
                  buildings={filteredBuildings}
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
                          fetchBuildings(currentPage - 1, { soft: true })
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
                          fetchBuildings(currentPage + 1, { soft: true })
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

      <BuildingFormModal
        open={formOpen}
        mode={formMode}
        building={editingBuilding}
        landOptions={landOptions}
        submitting={submitting}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditingBuilding(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <BuildingDetailsModal
        open={detailsOpen}
        building={selectedBuilding}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedBuilding(null);
        }}
        onEdit={(building) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedBuilding(null);
            },
            () => openEdit(building),
          );
        }}
        onDelete={(building) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedBuilding(null);
            },
            () => openDelete(building),
          );
        }}
      />

      <DeleteBuildingDialog
        open={deleteOpen}
        building={deletingBuilding}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeletingBuilding(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default Buildings;
