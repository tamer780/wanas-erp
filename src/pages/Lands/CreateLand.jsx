import { Map } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateLand = () => {
  return (
    <PageScaffold
      title="Create Land"
      description="Add a new land to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Lands", to: "/lands" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={Map}
        title="Create Land"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateLand;
