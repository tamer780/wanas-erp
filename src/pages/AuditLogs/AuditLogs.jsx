import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2, ScrollText } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import AuditLogsToolbar from "../../components/audit-logs/AuditLogsToolbar";
import AuditLogTable from "../../components/audit-logs/AuditLogTable";
import AuditLogsLoadingSkeleton from "../../components/audit-logs/AuditLogsLoadingSkeleton";
import AuditLogsErrorState from "../../components/audit-logs/AuditLogsErrorState";
import { auditLogsService, usersService } from "../../services";
import { paths } from "../../routes/pathnames";

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

const buildFilterParams = ({ action, userId, auditableType, from, to }) => {
  const params = {};
  if (action) params.action = action;
  if (userId) params.user_id = userId;
  if (auditableType) params.auditable_type = auditableType;
  if (from) params.from = from;
  if (to) params.to = to;
  return params;
};

const AuditLogs = () => {
  const navigate = useNavigate();
  const entrancePlayed = useRef(false);
  const loadMoreRef = useRef(null);

  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [auditableType, setAuditableType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const filters = useMemo(
    () => ({ action, userId, auditableType, from, to }),
    [action, userId, auditableType, from, to],
  );

  const usersQuery = useQuery({
    queryKey: ["users", "audit-logs-filter"],
    queryFn: async () => {
      const response = await usersService.getAll();
      return extractPaginatedList(response).items;
    },
  });

  const logsQuery = useInfiniteQuery({
    queryKey: ["audit-logs", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await auditLogsService.getAll({
        ...buildFilterParams(filters),
        page: pageParam,
      });
      return extractPaginatedList(response);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.lastPage
        ? lastPage.currentPage + 1
        : undefined,
  });

  const logs = useMemo(
    () => logsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [logsQuery.data],
  );

  const total = logsQuery.data?.pages?.[0]?.total ?? 0;

  useEffect(() => {
    if (!logsQuery.isSuccess || entrancePlayed.current) return undefined;
    entrancePlayed.current = true;
    setAnimateEntrance(true);
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [logsQuery.isSuccess]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry?.isIntersecting &&
          logsQuery.hasNextPage &&
          !logsQuery.isFetchingNextPage
        ) {
          logsQuery.fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [
    logsQuery.hasNextPage,
    logsQuery.isFetchingNextPage,
    logsQuery.fetchNextPage,
    logs.length,
  ]);

  const resetFilters = () => {
    setAction("");
    setUserId("");
    setAuditableType("");
    setFrom("");
    setTo("");
  };

  const openDetails = (log) => {
    if (!log?.id) return;
    navigate(paths.auditLogDetails(log.id));
  };

  const errorMessage =
    logsQuery.error?.response?.data?.message ||
    logsQuery.error?.message ||
    "Failed to load audit logs.";

  const isInitialLoading = logsQuery.isLoading;
  const isFilterFetching =
    logsQuery.isFetching && !logsQuery.isFetchingNextPage && !isInitialLoading;
  const hasFilters = Boolean(action || userId || auditableType || from || to);
  const showEmpty =
    !isInitialLoading &&
    !logsQuery.isError &&
    logs.length === 0 &&
    !hasFilters;
  const showFilteredEmpty =
    !isInitialLoading &&
    !logsQuery.isError &&
    logs.length === 0 &&
    hasFilters;

  return (
    <PageScaffold
      title="Audit Logs"
      description="Review system activity and change history."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Audit Logs" },
      ]}
    >
      <div className="space-y-4">
        {isInitialLoading ? <AuditLogsLoadingSkeleton /> : null}

        {!isInitialLoading && logsQuery.isError ? (
          <AuditLogsErrorState
            message={errorMessage}
            onRetry={() => logsQuery.refetch()}
          />
        ) : null}

        {!isInitialLoading && !logsQuery.isError ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              isFilterFetching ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={isFilterFetching}
          >
            <AuditLogsToolbar
              action={action}
              userId={userId}
              auditableType={auditableType}
              from={from}
              to={to}
              users={usersQuery.data ?? []}
              onActionChange={setAction}
              onUserIdChange={setUserId}
              onAuditableTypeChange={setAuditableType}
              onFromChange={setFrom}
              onToChange={setTo}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={ScrollText}
                  title="No Audit Logs Found"
                  description="Audit log entries will appear here once activity is recorded."
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={ScrollText}
                  title="No matching audit logs"
                  description="Try adjusting filters, or reset to see all audit logs."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <AuditLogTable
                  logs={logs}
                  onView={openDetails}
                  animateEntrance={animateEntrance}
                  refreshing={isFilterFetching}
                />

                <div
                  ref={loadMoreRef}
                  className="flex flex-col items-center justify-center gap-2 py-4"
                  aria-hidden={!logsQuery.hasNextPage}
                >
                  {logsQuery.isFetchingNextPage ? (
                    <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Loading more…
                    </span>
                  ) : null}

                  {!logsQuery.hasNextPage && logs.length > 0 ? (
                    <p className="text-sm text-text-muted">
                      Showing all {total || logs.length} audit logs
                    </p>
                  ) : null}

                  {logsQuery.hasNextPage &&
                  !logsQuery.isFetchingNextPage &&
                  logsQuery.isFetchNextPageError ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logsQuery.fetchNextPage()}
                    >
                      Load more
                    </Button>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </PageScaffold>
  );
};

export default AuditLogs;
