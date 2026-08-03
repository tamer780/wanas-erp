import { UserCog } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateUser = () => {
  return (
    <PageScaffold
      title="Create User"
      description="Add a new user to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Users", to: "/users" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={UserCog}
        title="Create User"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateUser;
