import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Package, Plus } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import MaterialPurchaseSummaryCards from "../../components/material-purchases/MaterialPurchaseSummaryCards";
import MaterialPurchasesToolbar from "../../components/material-purchases/MaterialPurchasesToolbar";
import MaterialPurchaseTable from "../../components/material-purchases/MaterialPurchaseTable";
import MaterialPurchaseFormModal from "../../components/material-purchases/MaterialPurchaseFormModal";
import MaterialPurchaseDetailsModal from "../../components/material-purchases/MaterialPurchaseDetailsModal";
import DeleteMaterialPurchaseDialog from "../../components/material-purchases/DeleteMaterialPurchaseDialog";
import MaterialPurchasesLoadingSkeleton from "../../components/material-purchases/MaterialPurchasesLoadingSkeleton";
import MaterialPurchasesErrorState from "../../components/material-purchases/MaterialPurchasesErrorState";
import { useToast } from "../../context/ToastContext";
import {
  buildingsService,
  landsService,
  materialPurchasesService,
  suppliersService,
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

const MaterialPurchases = () => {
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
  const [supplierFilter, setSupplierFilter] = useState("");

  const [supplierOptions, setSupplierOptions] = useState([]);
  const [landOptions, setLandOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);

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
      const response = await materialPurchasesService.getAll({ page });
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
          "Failed to load material purchases.",
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
      const [suppliersRes, landsRes, buildingsRes] = await Promise.all([
        suppliersService.getAll(),
        landsService.getAll(),
        buildingsService.getAll(),
      ]);
      setSupplierOptions(extractPaginatedList(suppliersRes).items);
      setLandOptions(extractPaginatedList(landsRes).items);
      setBuildingOptions(extractPaginatedList(buildingsRes).items);
    } catch {
      setSupplierOptions([]);
      setLandOptions([]);
      setBuildingOptions([]);
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

  const filterSuppliers = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      const supplier = item.supplier;
      const id = supplier?.id ?? item.supplier_id;
      if (!id || map.has(String(id))) return;
      map.set(String(id), supplier || { id, name: null });
    });
    return Array.from(map.values());
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      if (status && item.status !== status) return false;
      if (
        supplierFilter &&
        String(item.supplier_id ?? item.supplier?.id) !== String(supplierFilter)
      ) {
        return false;
      }
      if (!query) return true;

      const haystack = [
        translationText(item.title, "en"),
        translationText(item.title, "ar"),
        item.invoice_number,
        translationText(item.supplier?.name, "en"),
        translationText(item.supplier?.name, "ar"),
        translationText(item.land?.name, "en"),
        item.land?.code,
        translationText(item.building?.name, "en"),
        item.building?.code,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, search, status, supplierFilter]);

  const summary = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        const totalAmt = toNumber(item.total_amount);
        const paid = toNumber(item.paid_amount);
        acc.totalPurchases += 1;
        acc.totalAmount += totalAmt;
        acc.paidAmount += paid;
        acc.remaining += Math.max(totalAmt - paid, 0);
        if (item.status === "approved") acc.approvedCount += 1;
        return acc;
      },
      {
        totalPurchases: 0,
        totalAmount: 0,
        paidAmount: 0,
        remaining: 0,
        approvedCount: 0,
      },
    );
  }, [filteredItems]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setSupplierFilter("");
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
        await materialPurchasesService.update(editingItem.id, payload);
        toast.success("Material purchase updated successfully.");
      } else {
        await materialPurchasesService.create(payload);
        toast.success("Material purchase created successfully.");
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
      await materialPurchasesService.remove(deletingItem.id);
      setDeleteOpen(false);
      setDeletingItem(null);
      toast.success("Material purchase deleted successfully.");
      await fetchItems(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete material purchase.",
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
      title="Material Purchases"
      description="Manage material purchase orders and records."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Material Purchases" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New Purchase
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <MaterialPurchasesLoadingSkeleton /> : null}

        {!loading && error ? (
          <MaterialPurchasesErrorState
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
            <MaterialPurchaseSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <MaterialPurchasesToolbar
              search={search}
              status={status}
              supplierId={supplierFilter}
              supplierOptions={filterSuppliers}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onSupplierChange={setSupplierFilter}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Package}
                  title="No Material Purchases Found"
                  description="Material purchases will appear here once they are created."
                  actionLabel="New Purchase"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Package}
                  title="No matching purchases"
                  description="Try adjusting search or filters, or reset to see all purchases."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <MaterialPurchaseTable
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

      <MaterialPurchaseFormModal
        open={formOpen}
        mode={formMode}
        item={editingItem}
        submitting={submitting}
        supplierOptions={supplierOptions}
        landOptions={landOptions}
        buildingOptions={buildingOptions}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditingItem(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <MaterialPurchaseDetailsModal
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

      <DeleteMaterialPurchaseDialog
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

export default MaterialPurchases;
