import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hammer, Plus } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import WorkItemSummaryCards from "../../components/work-items/WorkItemSummaryCards";
import WorkItemsToolbar from "../../components/work-items/WorkItemsToolbar";
import WorkItemTable from "../../components/work-items/WorkItemTable";
import WorkItemFormModal from "../../components/work-items/WorkItemFormModal";
import WorkItemDetailsModal from "../../components/work-items/WorkItemDetailsModal";
import DeleteWorkItemDialog from "../../components/work-items/DeleteWorkItemDialog";
import WorkItemsLoadingSkeleton from "../../components/work-items/WorkItemsLoadingSkeleton";
import WorkItemsErrorState from "../../components/work-items/WorkItemsErrorState";
import { useToast } from "../../context/ToastContext";
import {
  buildingsService,
  contractorsService,
  landsService,
  workItemsService,
} from "../../services";
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

const WorkItems = () => {
  const toast = useToast();
  const entrancePlayed = useRef(false);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [workableType, setWorkableType] = useState("");

  const [contractorOptions, setContractorOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [landOptions, setLandOptions] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchItems = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await workItemsService.getAll({ page });
      const payload = extractPaginatedList(response);
      setItems(payload.items);
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
          "Failed to load work items.",
      );
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const [contractorsRes, buildingsRes, landsRes] = await Promise.all([
        contractorsService.getAll(),
        buildingsService.getAll(),
        landsService.getAll(),
      ]);
      setContractorOptions(extractPaginatedList(contractorsRes).items);
      setBuildingOptions(extractPaginatedList(buildingsRes).items);
      setLandOptions(extractPaginatedList(landsRes).items);
    } catch {
      setContractorOptions([]);
      setBuildingOptions([]);
      setLandOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchItems(1);
    fetchOptions();
  }, [fetchItems, fetchOptions]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      if (status && item.status !== status) return false;
      if (workableType && item.workable_type !== workableType) return false;
      if (!query) return true;

      const haystack = [
        translationText(item.title, "en"),
        translationText(item.title, "ar"),
        translationText(item.contractor?.name, "en"),
        translationText(item.contractor?.name, "ar"),
        translationText(item.workable?.name, "en"),
        translationText(item.workable?.name, "ar"),
        item.workable?.code,
        item.workable_type,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, search, status, workableType]);

  const summary = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        const agreed = toNumber(item.agreed_amount);
        const paid = toNumber(item.paid_amount);
        acc.totalItems += 1;
        acc.totalAgreed += agreed;
        acc.totalPaid += paid;
        acc.remaining += Math.max(agreed - paid, 0);
        if (item.status === "in_progress") acc.inProgress += 1;
        return acc;
      },
      {
        totalItems: 0,
        totalAgreed: 0,
        totalPaid: 0,
        remaining: 0,
        inProgress: 0,
      },
    );
  }, [filteredItems]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setWorkableType("");
  };

  const openCreate = () => {
    setFormMode("create");
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setFormMode("edit");
    setEditingItem(item);
    setFormOpen(true);
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const openDelete = (item) => {
    setDeletingItem(item);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (formMode === "edit" && editingItem?.id) {
        await workItemsService.update(editingItem.id, payload);
        toast.success("Work item updated successfully.");
      } else {
        await workItemsService.create(payload);
        toast.success("Work item created successfully.");
      }
      setFormOpen(false);
      setEditingItem(null);
      await fetchItems(currentPage, { soft: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem?.id) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await workItemsService.remove(deletingItem.id);
      setDeleteOpen(false);
      setDeletingItem(null);
      toast.success("Work item deleted successfully.");
      await fetchItems(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete work item.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const showEmpty =
    !loading && !error && filteredItems.length === 0 && items.length === 0;
  const showFilteredEmpty =
    !loading && !error && filteredItems.length === 0 && items.length > 0;

  return (
    <PageScaffold
      title="Work Items"
      description="Track construction work items, contractors, and progress."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Work Items" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New Work Item
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <WorkItemsLoadingSkeleton /> : null}

        {!loading && error ? (
          <WorkItemsErrorState
            message={error}
            onRetry={() => fetchItems(1)}
          />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <WorkItemSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <WorkItemsToolbar
              search={search}
              status={status}
              workableType={workableType}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onWorkableTypeChange={setWorkableType}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Hammer}
                  title="No Work Items Found"
                  description="Work items will appear here once they are created."
                  actionLabel="New Work Item"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Hammer}
                  title="No matching work items"
                  description="Try adjusting search or filters, or reset to see all items."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <WorkItemTable
                  items={filteredItems}
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
                          fetchItems(currentPage - 1, { soft: true })
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
                          fetchItems(currentPage + 1, { soft: true })
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

      <WorkItemFormModal
        open={formOpen}
        mode={formMode}
        item={editingItem}
        submitting={submitting}
        contractorOptions={contractorOptions}
        buildingOptions={buildingOptions}
        landOptions={landOptions}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditingItem(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <WorkItemDetailsModal
        open={detailsOpen}
        item={selectedItem}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedItem(null);
        }}
        onEdit={(item) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedItem(null);
            },
            () => openEdit(item),
          );
        }}
        onDelete={(item) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedItem(null);
            },
            () => openDelete(item),
          );
        }}
      />

      <DeleteWorkItemDialog
        open={deleteOpen}
        item={deletingItem}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeletingItem(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default WorkItems;
