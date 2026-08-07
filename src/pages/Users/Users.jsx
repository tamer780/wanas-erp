import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, UserCog } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import UserSummaryCards from "../../components/users/UserSummaryCards";
import UsersToolbar from "../../components/users/UsersToolbar";
import UserTable from "../../components/users/UserTable";
import UserFormModal from "../../components/users/UserFormModal";
import UserDetailsModal from "../../components/users/UserDetailsModal";
import DeleteUserDialog from "../../components/users/DeleteUserDialog";
import UsersLoadingSkeleton from "../../components/users/UsersLoadingSkeleton";
import UsersErrorState from "../../components/users/UsersErrorState";
import { useToast } from "../../context/ToastContext";
import { usersService } from "../../services";
import { transitionModals } from "../../utils/modalTransition";
import {
  formatRoleLabel,
  getUserPrimaryRole,
} from "../../utils/userValidation";

const extractUsersPayload = (response) => {
  const body = response?.data;
  const paginated = body?.data ?? body;
  const list = Array.isArray(paginated?.data)
    ? paginated.data
    : Array.isArray(paginated)
      ? paginated
      : [];

  return {
    users: list,
    total: paginated?.total ?? list.length,
    currentPage: paginated?.current_page ?? 1,
    lastPage: paginated?.last_page ?? 1,
  };
};

const Users = () => {
  const toast = useToast();
  const entrancePlayed = useRef(false);

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [animateEntrance, setAnimateEntrance] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = useCallback(async (page = 1, { soft = false } = {}) => {
    if (soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await usersService.getAll({ page });
      const payload = extractUsersPayload(response);
      setUsers(payload.users);
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
          "Failed to load users.",
      );
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  useEffect(() => {
    if (!animateEntrance) return undefined;
    const timer = window.setTimeout(() => setAnimateEntrance(false), 700);
    return () => window.clearTimeout(timer);
  }, [animateEntrance]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      if (status === "true" && !user.is_active) return false;
      if (status === "false" && user.is_active) return false;

      const primaryRole = getUserPrimaryRole(user);
      if (role && primaryRole !== role) return false;

      if (!query) return true;

      const haystack = [
        user.name,
        user.email,
        primaryRole,
        formatRoleLabel(primaryRole),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [users, search, status, role]);

  const summary = useMemo(() => {
    return filteredUsers.reduce(
      (acc, user) => {
        acc.totalUsers += 1;
        if (user.is_active) {
          acc.activeUsers += 1;
        } else {
          acc.inactiveUsers += 1;
        }
        return acc;
      },
      {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
      },
    );
  }, [filteredUsers]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setRole("");
  };

  const openCreate = () => {
    setFormMode("create");
    setEditingUser(null);
    setFormOpen(true);
  };

  const openEdit = (user) => {
    setFormMode("edit");
    setEditingUser(user);
    setFormOpen(true);
  };

  const openDetails = (user) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const openDelete = (user) => {
    setDeletingUser(user);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (formMode === "edit" && editingUser?.id) {
        await usersService.update(editingUser.id, payload);
        toast.success("User updated successfully.");
      } else {
        await usersService.create(payload);
        toast.success("User created successfully.");
      }
      setFormOpen(false);
      setEditingUser(null);
      await fetchUsers(currentPage, { soft: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser?.id) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await usersService.remove(deletingUser.id);
      setDeleteOpen(false);
      setDeletingUser(null);
      toast.success("User deleted successfully.");
      await fetchUsers(currentPage, { soft: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete user.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const showEmpty =
    !loading && !error && filteredUsers.length === 0 && users.length === 0;
  const showFilteredEmpty =
    !loading && !error && filteredUsers.length === 0 && users.length > 0;

  return (
    <PageScaffold
      title="Users"
      description="Manage system users and access roles."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Users" },
      ]}
      actions={
        <Button type="button" size="md" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New User
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? <UsersLoadingSkeleton /> : null}

        {!loading && error ? (
          <UsersErrorState message={error} onRetry={() => fetchUsers(1)} />
        ) : null}

        {!loading && !error ? (
          <div
            className={`space-y-4 transition-opacity duration-200 ${
              refreshing ? "pointer-events-none opacity-60" : ""
            }`}
            aria-busy={refreshing}
          >
            <UserSummaryCards
              summary={summary}
              animateEntrance={animateEntrance}
            />
            <UsersToolbar
              search={search}
              status={status}
              role={role}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onRoleChange={setRole}
              onReset={resetFilters}
            />

            {showEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={UserCog}
                  title="No Users Found"
                  description="Users will appear here once they are created."
                  actionLabel="New User"
                  onAction={openCreate}
                />
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="rounded-2xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={UserCog}
                  title="No matching users"
                  description="Try adjusting search or filters, or reset to see all users."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : null}

            {!showEmpty && !showFilteredEmpty ? (
              <>
                <UserTable
                  users={filteredUsers}
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
                          fetchUsers(currentPage - 1, { soft: true })
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
                          fetchUsers(currentPage + 1, { soft: true })
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

      <UserFormModal
        open={formOpen}
        mode={formMode}
        user={editingUser}
        submitting={submitting}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditingUser(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <UserDetailsModal
        open={detailsOpen}
        user={selectedUser}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedUser(null);
        }}
        onEdit={(user) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedUser(null);
            },
            () => openEdit(user),
          );
        }}
        onDelete={(user) => {
          transitionModals(
            () => {
              setDetailsOpen(false);
              setSelectedUser(null);
            },
            () => openDelete(user),
          );
        }}
      />

      <DeleteUserDialog
        open={deleteOpen}
        user={deletingUser}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeletingUser(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </PageScaffold>
  );
};

export default Users;
