import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Users } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import ClientSummaryCards from "../../components/clients/ClientSummaryCards";
import ClientsToolbar from "../../components/clients/ClientsToolbar";
import ClientTable from "../../components/clients/ClientTable";
import ClientFormModal from "../../components/clients/ClientFormModal";
import ClientDetailsModal from "../../components/clients/ClientDetailsModal";
import DeleteClientDialog from "../../components/clients/DeleteClientDialog";
import ClientsLoadingSkeleton from "../../components/clients/ClientsLoadingSkeleton";
import ClientsErrorState from "../../components/clients/ClientsErrorState";
import { useToast } from "../../context/ToastContext";
import { clientsService } from "../../services";
import { translationText } from "../../utils/format";
import { transitionModals } from "../../utils/modalTransition";

const extractClientsPayload = (response) => {
  const body = response?.data;
  const paginated = body?.data ?? body;
  const list = Array.isArray(paginated?.data)
    ? paginated.data
    : Array.isArray(paginated)
      ? paginated
      : [];

  return {
    clients: list,
    total: paginated?.total ?? list.length,
    currentPage: paginated?.current_page ?? 1,
    lastPage: paginated?.last_page ?? 1,
  };
};

const Clients = () => {
  const toast = useToast();
  const entrancePlayed = useRef(false);

  const [clients, setClients] = useState([]);
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
  const [editingClient, setEditingClient] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchClients = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await clientsService.getAll({ page });
      const payload = extractClientsPayload(response);
      setClients(payload.clients);
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
          "Failed to load clients.",
      );
      setClients([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchClients(1);
  }, [fetchClients]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return clients.filter((client) => {
      if (status === "true" && !client.is_active) return false;
      if (status === "false" && client.is_active) return false;

      if (!query) return true;

      const haystack = [
        translationText(client.name, "en"),
        translationText(client.name, "ar"),
        client.email,
        client.phone,
        client.address,
        client.tax_id,
        client.national_id,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [clients, search, status]);

  const summary = useMemo(() => {
    return filteredClients.reduce(
      (acc, client) => {
        acc.totalClients += 1;
        if (client.is_active) {
          acc.activeClients += 1;
        } else {
          acc.inactiveClients += 1;
        }
        return acc;
      },
      {
        totalClients: 0,
        activeClients: 0,
        inactiveClients: 0,
      },
    );
  }, [filteredClients]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
  };

  const openCreate = () => {
    setFormMode("create");
    setEditingClient(null);
    setFormOpen(true);
  };

  const openEdit = (client) => {
    setFormMode("edit");
    setEditingClient(client);
    setFormOpen(true);
  };

  const openDetails = (client) => {
    setSelectedClient(client);
    setDetailsOpen(true);
  };

  const openDelete = (client) => {
    setDeletingClient(client);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (formMode === "edit" && editingClient?.id) {
        await clientsService.update(editingClient.id, payload);
        toast.success("Client updated successfully.");
      } else {
        await clientsService.create(payload);
        toast.success("Client created successfully.");
      }
      setFormOpen(false);
      setEditingClient(null);
      await fetchClients(currentPage, { soft: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingClient?.id) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await clientsService.remove(deletingClient.id);
      setDeleteOpen(false);
      setDeletingClient(null);
      toast.success("Client deleted successfully.");
      await fetchClients(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete client.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const showEmpty =
    !loading && !error && filteredClients.length === 0 && clients.length === 0;
  const showFilteredEmpty =
    !loading &&
    !error &&
    filteredClients.length === 0 &&
    clients.length > 0;

  return (
    <PageScaffold
      title="Clients Management"
      description="Manage client profiles, contact details, and status."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Clients" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New Client
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <ClientsLoadingSkeleton /> : null}

        {!loading && error ? (
          <ClientsErrorState
            message={error}
            onRetry={() => fetchClients(1)}
          />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <ClientSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <ClientsToolbar
              search={search}
              status={status}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Users}
                  title="No Clients Found"
                  description="Clients will appear here once they are created."
                  actionLabel="New Client"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Users}
                  title="No matching clients"
                  description="Try adjusting search or filters, or reset to see all clients."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <ClientTable
                  clients={filteredClients}
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
                          fetchClients(currentPage - 1, { soft: true })
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
                          fetchClients(currentPage + 1, { soft: true })
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

      <ClientFormModal
        open={formOpen}
        mode={formMode}
        client={editingClient}
        submitting={submitting}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditingClient(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <ClientDetailsModal
        open={detailsOpen}
        client={selectedClient}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedClient(null);
        }}
        onEdit={(client) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedClient(null);
            },
            () => openEdit(client),
          );
        }}
        onDelete={(client) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedClient(null);
            },
            () => openDelete(client),
          );
        }}
      />

      <DeleteClientDialog
        open={deleteOpen}
        client={deletingClient}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeletingClient(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default Clients;
