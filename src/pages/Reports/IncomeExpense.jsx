import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BarChart3 } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import IncomeExpenseSummaryCards from "../../components/reports/IncomeExpenseSummaryCards";
import IncomeExpenseToolbar from "../../components/reports/IncomeExpenseToolbar";
import IncomeExpenseTable from "../../components/reports/IncomeExpenseTable";
import IncomeExpenseLoadingSkeleton from "../../components/reports/IncomeExpenseLoadingSkeleton";
import IncomeExpenseErrorState from "../../components/reports/IncomeExpenseErrorState";
import {
  buildingsService,
  landsService,
  reportsService,
  unitsService,
} from "../../services";

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

const extractReportPayload = (response) => {
  const data = response?.data?.data ?? response?.data ?? {};
  const transactionsPayload = data?.transactions ?? {};
  const list = Array.isArray(transactionsPayload?.data)
    ? transactionsPayload.data
    : Array.isArray(transactionsPayload)
      ? transactionsPayload
      : [];

  return {
    income: data?.income ?? 0,
    expense: data?.expense ?? 0,
    net: data?.net ?? 0,
    transactions: list,
    total: transactionsPayload?.total ?? list.length,
    currentPage: transactionsPayload?.current_page ?? 1,
    lastPage: transactionsPayload?.last_page ?? 1,
  };
};

const buildParams = ({ from, to, landId, buildingId, unitId, category, page }) => {
  const params = { page };
  if (from) params.from = from;
  if (to) params.to = to;
  if (landId) params.land_id = landId;
  if (buildingId) params.building_id = buildingId;
  if (unitId) params.unit_id = unitId;
  if (category) params.category = category;
  return params;
};

const IncomeExpense = () => {
  const entrancePlayed = useRef(false);
  const filtersRef = useRef({});

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [net, setNet] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [landId, setLandId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [category, setCategory] = useState("");

  const [landOptions, setLandOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  filtersRef.current = { from, to, landId, buildingId, unitId, category };

  const fetchReport = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await reportsService.getIncomeExpense(
        buildParams({ ...filtersRef.current, page }),
      );
      const payload = extractReportPayload(response);
      setIncome(payload.income);
      setExpense(payload.expense);
      setNet(payload.net);
      setTransactions(payload.transactions);
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
          "Failed to load income & expense report.",
      );
      setTransactions([]);
      setTotal(0);
      setIncome(0);
      setExpense(0);
      setNet(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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
    fetchReport(1, { soft: entrancePlayed.current });
  }, [fetchReport, from, to, landId, buildingId, unitId, category]);

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

  const summary = useMemo(
    () => ({ income, expense, net }),
    [income, expense, net],
  );

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
    setFrom("");
    setTo("");
    setLandId("");
    setBuildingId("");
    setUnitId("");
    setCategory("");
  };

  const hasFilters = Boolean(
    from || to || landId || buildingId || unitId || category,
  );
  const showEmpty =
    !loading && !error && transactions.length === 0 && !hasFilters;
  const showFilteredEmpty =
    !loading && !error && transactions.length === 0 && hasFilters;

  return (
    <PageScaffold
      title="Reports"
      description="Income and expense overview across projects."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Reports" },
      ]}
    >
      <div className="space-y-4">
        {loading ? <IncomeExpenseLoadingSkeleton /> : null}

        {!loading && error ? (
          <IncomeExpenseErrorState
            message={error}
            onRetry={() => fetchReport(1)}
          />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <IncomeExpenseSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <IncomeExpenseToolbar
              from={from}
              to={to}
              landId={landId}
              buildingId={buildingId}
              unitId={unitId}
              category={category}
              lands={landOptions}
              buildings={filteredBuildings}
              units={filteredUnits}
              onFromChange={setFrom}
              onToChange={setTo}
              onLandChange={handleLandChange}
              onBuildingChange={handleBuildingChange}
              onUnitChange={setUnitId}
              onCategoryChange={setCategory}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={BarChart3}
                  title="No Transactions Found"
                  description="Income and expense transactions will appear here once recorded."
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={BarChart3}
                  title="No matching transactions"
                  description="Try adjusting date range or filters, or reset to see all transactions."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <IncomeExpenseTable
                  transactions={transactions}
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
                          fetchReport(currentPage - 1, { soft: true })
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
                          fetchReport(currentPage + 1, { soft: true })
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
    </PageScaffold>
  );
};

export default IncomeExpense;
