import { Link } from "react-router-dom";
import { UserCog } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const Users = () => {
  return (
    <PageScaffold
      title="Users"
      description="Manage system users and access roles."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Users" },
      ]}
      actions={
        <Link
          to="/users/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create User
        </Link>
      }
    >
      <EmptyState
        icon={UserCog}
        title="No Users Found"
        description="Users will appear here once they are created."
        actionLabel="Create User"
        actionTo="/users/create"
      />
    </PageScaffold>
  );
};

export default Users;
