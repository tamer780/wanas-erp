import { Map } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditLand = () => {
  return (
    <PageScaffold
      title="Edit Land"
      description="Update land information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Lands", to: "/lands" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={Map}
        title="Edit Land"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditLand;
