import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Wallet } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import FinancialTransactionSummaryCards from "../../components/financial-transactions/FinancialTransactionSummaryCards";
import FinancialTransactionsToolbar from "../../components/financial-transactions/FinancialTransactionsToolbar";
import FinancialTransactionTable from "../../components/financial-transactions/FinancialTransactionTable";
import FinancialTransactionsLoadingSkeleton from "../../components/financial-transactions/FinancialTransactionsLoadingSkeleton";
import FinancialTransactionsErrorState from "../../components/financial-transactions/FinancialTransactionsErrorState";
import VoidTransactionDialog from "../../components/financial-transactions/VoidTransactionDialog";
import { useToast } from "../../context/ToastContext";
import {
  buildingsService,
  financialTransactionsService,
  landsService,
  unitsService,
} from "../../services";
import { toNumber } from "../../utils/format";

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

const buildParams = ({
  type,
  category,
  from,
  to,
  landId,
  buildingId,
  unitId,
  page,
}) => {
  const params = { page };
  if (type) params.type = type;
  if (category) params.category = category;
  if (from) params.from = from;
  if (to) params.to = to;
  if (landId) params.land_id = landId;
  if (buildingId) params.building_id = buildingId;
  if (unitId) params.unit_id = unitId;
  return params;
};

const FinancialTransactions = () => {
  const toast = useToast();
  const entrancePlayed = useRef(false);
  const filtersRef = useRef({});

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [landId, setLandId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [unitId, setUnitId] = useState("");

  const [landOptions, setLandOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  const [voidOpen, setVoidOpen] = useState(false);
  const [voidingTransaction, setVoidingTransaction] = useState(null);
  const [voiding, setVoiding] = useState(false);
  const [voidError, setVoidError] = useState("");

  filtersRef.current = {
    type,
    category,
    from,
    to,
    landId,
    buildingId,
    unitId,
  };

  const fetchTransactions = useCallback(
    async (page = 1, { soft = false } = {}) => {
      if (soft) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
        const response = await financialTransactionsService.getAll(
          buildParams({ ...filtersRef.current, page }),
        );
        const payload = extractPaginatedList(response);
        setTransactions(payload.items);
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
            "Failed to load financial transactions.",
        );
        setTransactions([]);
        setTotal(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const fetchOptions = useCallback(async () => {
    try {
      const [landsRes, buildingsRes, unitsRes] = await Promise.all([
        landsService.getAll(),
        buildingsService.getAll(),
        unitsService.getAll(),
      ]);
      setLandOptions(extractPaginatedList(landsRes).items);
      setBuildingOptions(extractPaginatedList(buildingsRes).items);
      setUnitOptions(extractPaginatedList(unitsRes).items);
    } catch {
      setLandOptions([]);
      setBuildingOptions([]);
      setUnitOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchTransactions(1, { soft: entrancePlayed.current });
  }, [fetchTransactions, type, category, from, to, landId, buildingId, unitId]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const filteredBuildings = useMemo(() => {
    if (!landId) return buildingOptions;
    return buildingOptions.filter(
      (building) => String(building.land_id ?? building.land?.id) === landId,
    );
  }, [buildingOptions, landId]);

  const filteredUnits = useMemo(() => {
    if (!buildingId) return unitOptions;
    return unitOptions.filter(
      (unit) => String(unit.building_id ?? unit.building?.id) === buildingId,
    );
  }, [unitOptions, buildingId]);

  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        acc.total += 1;
        const amount = toNumber(transaction.amount);
        if (String(transaction.type || "").toLowerCase() === "income") {
          acc.income += amount;
        } else if (String(transaction.type || "").toLowerCase() === "expense") {
          acc.expense += amount;
        }
        return acc;
      },
      { total: 0, income: 0, expense: 0 },
    );
  }, [transactions]);

  const handleLandChange = (value) => {
    setLandId(value);
    setBuildingId("");
    setUnitId("");
  };

  const handleBuildingChange = (value) => {
    setBuildingId(value);
    setUnitId("");
  };

  const resetFilters = () => {
    setType("");
    setCategory("");
    setFrom("");
    setTo("");
    setLandId("");
    setBuildingId("");
    setUnitId("");
  };

  const openVoid = (transaction) => {
    setVoidingTransaction(transaction);
    setVoidError("");
    setVoidOpen(true);
  };

  const closeVoid = () => {
    if (voiding) return;
    setVoidOpen(false);
    setVoidingTransaction(null);
    setVoidError("");
  };

  const confirmVoid = async (reason) => {
    if (!voidingTransaction?.id) return;
    setVoiding(true);
    setVoidError("");
    try {
      const response = await financialTransactionsService.void(
        voidingTransaction.id,
        { reason },
      );
      const message =
        response?.data?.message || "Transaction voided.";
      setVoidOpen(false);
      setVoidingTransaction(null);
      toast.success(message);
      await fetchTransactions(currentPage, { soft: true });
    } catch (err) {
      setVoidError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to void transaction.",
      );
    } finally {
      setVoiding(false);
    }
  };

  const hasFilters = Boolean(
    type || category || from || to || landId || buildingId || unitId,
  );
  const showEmpty =
    !loading && !error && transactions.length === 0 && !hasFilters;
  const showFilteredEmpty =
    !loading && !error && transactions.length === 0 && hasFilters;

  return (
    <PageScaffold
      title="Financial Transactions"
      description="Track income and expense transactions."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Financial Transactions" },
      ]}
    >
      <div className="space-y-4">
        {loading ? <FinancialTransactionsLoadingSkeleton /> : null}

        {!loading && error ? (
          <FinancialTransactionsErrorState
            message={error}
            onRetry={() => fetchTransactions(1)}
          />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <FinancialTransactionSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <FinancialTransactionsToolbar
              type={type}
              category={category}
              from={from}
              to={to}
              landId={landId}
              buildingId={buildingId}
              unitId={unitId}
              lands={landOptions}
              buildings={filteredBuildings}
              units={filteredUnits}
              onTypeChange={setType}
              onCategoryChange={setCategory}
              onFromChange={setFrom}
              onToChange={setTo}
              onLandChange={handleLandChange}
              onBuildingChange={handleBuildingChange}
              onUnitChange={setUnitId}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Wallet}
                  title="No Financial Transactions Found"
                  description="Financial transactions will appear here once they are recorded."
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Wallet}
                  title="No matching transactions"
                  description="Try adjusting filters, or reset to see all transactions."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <FinancialTransactionTable
                  transactions={transactions}
                  onVoid={openVoid}
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
                          fetchTransactions(currentPage - 1, { soft: true })
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
                          fetchTransactions(currentPage + 1, { soft: true })
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

      <VoidTransactionDialog
        open={voidOpen}
        transaction={voidingTransaction}
        submitting={voiding}
        error={voidError}
        onClose={closeVoid}
        onConfirm={confirmVoid}
      />
    </PageScaffold>
  );
};

export default FinancialTransactions;
