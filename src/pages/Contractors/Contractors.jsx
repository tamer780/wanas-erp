import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HardHat, Plus } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import ContractorSummaryCards from "../../components/contractors/ContractorSummaryCards";
import ContractorsToolbar from "../../components/contractors/ContractorsToolbar";
import ContractorTable from "../../components/contractors/ContractorTable";
import ContractorFormModal from "../../components/contractors/ContractorFormModal";
import ContractorDetailsModal from "../../components/contractors/ContractorDetailsModal";
import DeleteContractorDialog from "../../components/contractors/DeleteContractorDialog";
import ContractorsLoadingSkeleton from "../../components/contractors/ContractorsLoadingSkeleton";
import ContractorsErrorState from "../../components/contractors/ContractorsErrorState";
import { useToast } from "../../context/ToastContext";
import { contractorsService } from "../../services";
import { translationText } from "../../utils/format";
import { transitionModals } from "../../utils/modalTransition";

const extractContractorsPayload = (response) => {
  const body = response?.data;
  const paginated = body?.data ?? body;
  const list = Array.isArray(paginated?.data)
    ? paginated.data
    : Array.isArray(paginated)
      ? paginated
      : [];

  return {
    contractors: list,
    total: paginated?.total ?? list.length,
    currentPage: paginated?.current_page ?? 1,
    lastPage: paginated?.last_page ?? 1,
  };
};

const Contractors = () => {
  const toast = useToast();
  const entrancePlayed = useRef(false);

  const [contractors, setContractors] = useState([]);
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
  const [editingContractor, setEditingContractor] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingContractor, setDeletingContractor] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchContractors = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await contractorsService.getAll({ page });
      const payload = extractContractorsPayload(response);
      setContractors(payload.contractors);
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
          "Failed to load contractors.",
      );
      setContractors([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchContractors(1);
  }, [fetchContractors]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const filteredContractors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contractors.filter((contractor) => {
      if (status === "true" && !contractor.is_active) return false;
      if (status === "false" && contractor.is_active) return false;

      if (!query) return true;

      const haystack = [
        translationText(contractor.name, "en"),
        translationText(contractor.name, "ar"),
        contractor.email,
        contractor.phone,
        contractor.address,
        contractor.tax_id,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [contractors, search, status]);

  const summary = useMemo(() => {
    return filteredContractors.reduce(
      (acc, contractor) => {
        acc.totalContractors += 1;
        if (contractor.is_active) {
          acc.activeContractors += 1;
        } else {
          acc.inactiveContractors += 1;
        }
        return acc;
      },
      {
        totalContractors: 0,
        activeContractors: 0,
        inactiveContractors: 0,
      },
    );
  }, [filteredContractors]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
  };

  const openCreate = () => {
    setFormMode("create");
    setEditingContractor(null);
    setFormOpen(true);
  };

  const openEdit = (contractor) => {
    setFormMode("edit");
    setEditingContractor(contractor);
    setFormOpen(true);
  };

  const openDetails = (contractor) => {
    setSelectedContractor(contractor);
    setDetailsOpen(true);
  };

  const openDelete = (contractor) => {
    setDeletingContractor(contractor);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (formMode === "edit" && editingContractor?.id) {
        await contractorsService.update(editingContractor.id, payload);
        toast.success("Contractor updated successfully.");
      } else {
        await contractorsService.create(payload);
        toast.success("Contractor created successfully.");
      }
      setFormOpen(false);
      setEditingContractor(null);
      await fetchContractors(currentPage, { soft: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingContractor?.id) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await contractorsService.remove(deletingContractor.id);
      setDeleteOpen(false);
      setDeletingContractor(null);
      toast.success("Contractor deleted successfully.");
      await fetchContractors(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete contractor.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const showEmpty =
    !loading &&
    !error &&
    filteredContractors.length === 0 &&
    contractors.length === 0;
  const showFilteredEmpty =
    !loading &&
    !error &&
    filteredContractors.length === 0 &&
    contractors.length > 0;

  return (
    <PageScaffold
      title="Contractors"
      description="Manage contractors and construction partners."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Contractors" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New Contractor
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <ContractorsLoadingSkeleton /> : null}

        {!loading && error ? (
          <ContractorsErrorState
            message={error}
            onRetry={() => fetchContractors(1)}
          />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <ContractorSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <ContractorsToolbar
              search={search}
              status={status}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={HardHat}
                  title="No Contractors Found"
                  description="Contractors will appear here once they are created."
                  actionLabel="New Contractor"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={HardHat}
                  title="No matching contractors"
                  description="Try adjusting search or filters, or reset to see all contractors."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <ContractorTable
                  contractors={filteredContractors}
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
                          fetchContractors(currentPage - 1, { soft: true })
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
                          fetchContractors(currentPage + 1, { soft: true })
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

      <ContractorFormModal
        open={formOpen}
        mode={formMode}
        contractor={editingContractor}
        submitting={submitting}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditingContractor(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <ContractorDetailsModal
        open={detailsOpen}
        contractor={selectedContractor}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedContractor(null);
        }}
        onEdit={(contractor) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedContractor(null);
            },
            () => openEdit(contractor),
          );
        }}
        onDelete={(contractor) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedContractor(null);
            },
            () => openDelete(contractor),
          );
        }}
      />

      <DeleteContractorDialog
        open={deleteOpen}
        contractor={deletingContractor}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeletingContractor(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default Contractors;
