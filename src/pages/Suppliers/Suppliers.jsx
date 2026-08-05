import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Truck } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import SupplierSummaryCards from "../../components/suppliers/SupplierSummaryCards";
import SuppliersToolbar from "../../components/suppliers/SuppliersToolbar";
import SupplierTable from "../../components/suppliers/SupplierTable";
import SupplierFormModal from "../../components/suppliers/SupplierFormModal";
import SupplierDetailsModal from "../../components/suppliers/SupplierDetailsModal";
import DeleteSupplierDialog from "../../components/suppliers/DeleteSupplierDialog";
import SuppliersLoadingSkeleton from "../../components/suppliers/SuppliersLoadingSkeleton";
import SuppliersErrorState from "../../components/suppliers/SuppliersErrorState";
import { useToast } from "../../context/ToastContext";
import { suppliersService } from "../../services";
import { translationText } from "../../utils/format";
import { transitionModals } from "../../utils/modalTransition";

const extractSuppliersPayload = (response) => {
  const body = response?.data;
  const paginated = body?.data ?? body;
  const list = Array.isArray(paginated?.data)
    ? paginated.data
    : Array.isArray(paginated)
      ? paginated
      : [];

  return {
    suppliers: list,
    total: paginated?.total ?? list.length,
    currentPage: paginated?.current_page ?? 1,
    lastPage: paginated?.last_page ?? 1,
  };
};

const Suppliers = () => {
  const toast = useToast();
  const entrancePlayed = useRef(false);

  const [suppliers, setSuppliers] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchSuppliers = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await suppliersService.getAll({ page });
      const payload = extractSuppliersPayload(response);
      setSuppliers(payload.suppliers);
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
          "Failed to load suppliers.",
      );
      setSuppliers([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers(1);
  }, [fetchSuppliers]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      if (status === "true" && !supplier.is_active) return false;
      if (status === "false" && supplier.is_active) return false;

      if (!query) return true;

      const haystack = [
        translationText(supplier.name, "en"),
        translationText(supplier.name, "ar"),
        supplier.email,
        supplier.phone,
        supplier.address,
        supplier.tax_id,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [suppliers, search, status]);

  const summary = useMemo(() => {
    return filteredSuppliers.reduce(
      (acc, supplier) => {
        acc.totalSuppliers += 1;
        if (supplier.is_active) {
          acc.activeSuppliers += 1;
        } else {
          acc.inactiveSuppliers += 1;
        }
        return acc;
      },
      {
        totalSuppliers: 0,
        activeSuppliers: 0,
        inactiveSuppliers: 0,
      },
    );
  }, [filteredSuppliers]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
  };

  const openCreate = () => {
    setFormMode("create");
    setEditingSupplier(null);
    setFormOpen(true);
  };

  const openEdit = (supplier) => {
    setFormMode("edit");
    setEditingSupplier(supplier);
    setFormOpen(true);
  };

  const openDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setDetailsOpen(true);
  };

  const openDelete = (supplier) => {
    setDeletingSupplier(supplier);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (formMode === "edit" && editingSupplier?.id) {
        await suppliersService.update(editingSupplier.id, payload);
        toast.success("Supplier updated successfully.");
      } else {
        await suppliersService.create(payload);
        toast.success("Supplier created successfully.");
      }
      setFormOpen(false);
      setEditingSupplier(null);
      await fetchSuppliers(currentPage, { soft: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSupplier?.id) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await suppliersService.remove(deletingSupplier.id);
      setDeleteOpen(false);
      setDeletingSupplier(null);
      toast.success("Supplier deleted successfully.");
      await fetchSuppliers(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete supplier.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const showEmpty =
    !loading &&
    !error &&
    filteredSuppliers.length === 0 &&
    suppliers.length === 0;
  const showFilteredEmpty =
    !loading &&
    !error &&
    filteredSuppliers.length === 0 &&
    suppliers.length > 0;

  return (
    <PageScaffold
      title="Suppliers"
      description="Manage suppliers and vendor relationships."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Suppliers" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New Supplier
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <SuppliersLoadingSkeleton /> : null}

        {!loading && error ? (
          <SuppliersErrorState
            message={error}
            onRetry={() => fetchSuppliers(1)}
          />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <SupplierSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <SuppliersToolbar
              search={search}
              status={status}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Truck}
                  title="No Suppliers Found"
                  description="Suppliers will appear here once they are created."
                  actionLabel="New Supplier"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Truck}
                  title="No matching suppliers"
                  description="Try adjusting search or filters, or reset to see all suppliers."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <SupplierTable
                  suppliers={filteredSuppliers}
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
                          fetchSuppliers(currentPage - 1, { soft: true })
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
                          fetchSuppliers(currentPage + 1, { soft: true })
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

      <SupplierFormModal
        open={formOpen}
        mode={formMode}
        supplier={editingSupplier}
        submitting={submitting}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditingSupplier(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <SupplierDetailsModal
        open={detailsOpen}
        supplier={selectedSupplier}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedSupplier(null);
        }}
        onEdit={(supplier) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedSupplier(null);
            },
            () => openEdit(supplier),
          );
        }}
        onDelete={(supplier) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedSupplier(null);
            },
            () => openDelete(supplier),
          );
        }}
      />

      <DeleteSupplierDialog
        open={deleteOpen}
        supplier={deletingSupplier}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeletingSupplier(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default Suppliers;
