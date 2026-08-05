import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Handshake, Plus } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import UnitSaleSummaryCards from "../../components/unit-sales/UnitSaleSummaryCards";
import UnitSalesToolbar from "../../components/unit-sales/UnitSalesToolbar";
import UnitSaleTable from "../../components/unit-sales/UnitSaleTable";
import DeleteUnitSaleDialog from "../../components/unit-sales/DeleteUnitSaleDialog";
import UnitSalesLoadingSkeleton from "../../components/unit-sales/UnitSalesLoadingSkeleton";
import UnitSalesErrorState from "../../components/unit-sales/UnitSalesErrorState";
import { useToast } from "../../context/ToastContext";
import { unitSalesService } from "../../services";
import { toNumber, translationText } from "../../utils/format";

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

const UnitSales = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const entrancePlayed = useRef(false);

  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const [search, setSearch] = useState("");
  const [saleType, setSaleType] = useState("");
  const [status, setStatus] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingSale, setDeletingSale] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchSales = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await unitSalesService.getAll({ page });
      const payload = extractPaginatedList(response);
      setSales(payload.items);
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
          "Failed to load unit sales.",
      );
      setSales([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSales(1);
  }, [fetchSales]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const filteredSales = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sales.filter((sale) => {
      if (saleType && sale.sale_type !== saleType) return false;
      if (status && sale.status !== status) return false;
      if (!query) return true;

      const haystack = [
        sale.contract_number,
        sale.unit?.code,
        translationText(sale.unit?.name, "en"),
        translationText(sale.unit?.name, "ar"),
        translationText(sale.client?.name, "en"),
        translationText(sale.client?.name, "ar"),
        sale.client?.email,
        sale.client?.phone,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [sales, search, saleType, status]);

  const summary = useMemo(() => {
    return filteredSales.reduce(
      (acc, sale) => {
        const totalPrice = toNumber(sale.total_price);
        const paid = toNumber(sale.paid_amount);
        acc.totalSales += 1;
        acc.totalPrice += totalPrice;
        acc.paidAmount += paid;
        acc.remainingAmount += Math.max(totalPrice - paid, 0);
        if (sale.status === "active") acc.activeSales += 1;
        return acc;
      },
      {
        totalSales: 0,
        totalPrice: 0,
        paidAmount: 0,
        remainingAmount: 0,
        activeSales: 0,
      },
    );
  }, [filteredSales]);

  const resetFilters = () => {
    setSearch("");
    setSaleType("");
    setStatus("");
  };

  const openCreate = () => navigate("/unit-sales/create");
  const openDetails = (sale) => navigate(`/unit-sales/${sale.id}`);
  const openEdit = (sale) => navigate(`/unit-sales/${sale.id}/edit`);

  const openDelete = (sale) => {
    setDeletingSale(sale);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingSale?.id) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await unitSalesService.remove(deletingSale.id);
      setDeleteOpen(false);
      setDeletingSale(null);
      toast.success("Unit sale deleted successfully.");
      await fetchSales(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete unit sale.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const showEmpty =
    !loading && !error && filteredSales.length === 0 && sales.length === 0;
  const showFilteredEmpty =
    !loading && !error && filteredSales.length === 0 && sales.length > 0;

  return (
    <PageScaffold
      title="Unit Sales"
      description="Manage unit sales, contracts, and payment progress."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Unit Sales" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          Create Unit Sale
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <UnitSalesLoadingSkeleton /> : null}

        {!loading && error ? (
          <UnitSalesErrorState
            message={error}
            onRetry={() => fetchSales(1)}
          />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <UnitSaleSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <UnitSalesToolbar
              search={search}
              saleType={saleType}
              status={status}
              onSearchChange={setSearch}
              onSaleTypeChange={setSaleType}
              onStatusChange={setStatus}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Handshake}
                  title="No Unit Sales Found"
                  description="Unit sales will appear here once they are created."
                  actionLabel="Create Unit Sale"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Handshake}
                  title="No matching unit sales"
                  description="Try adjusting search or filters, or reset to see all sales."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <UnitSaleTable
                  sales={filteredSales}
                  onView={openDetails}
                  onEdit={openEdit}
                  onDelete={openDelete}
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
                          fetchSales(currentPage - 1, { soft: true })
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
                          fetchSales(currentPage + 1, { soft: true })
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

      <DeleteUnitSaleDialog
        open={deleteOpen}
        sale={deletingSale}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeletingSale(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default UnitSales;
