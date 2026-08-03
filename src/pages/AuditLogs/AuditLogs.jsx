import { ScrollText } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const AuditLogs = () => {
  return (
    <PageScaffold
      title="Audit Logs"
      description="Review system activity and change history."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Audit Logs" },
      ]}
    >
      <EmptyState
        icon={ScrollText}
        title="No Audit Logs Found"
        description="Audit log entries will appear here once activity is recorded."
      />
    </PageScaffold>
  );
};

export default AuditLogs;
