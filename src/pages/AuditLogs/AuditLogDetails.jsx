import { ScrollText } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const AuditLogDetails = () => {
  return (
    <PageScaffold
      title="Audit Log Details"
      description="View detailed information for this audit entry."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Audit Logs", to: "/audit-logs" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={ScrollText}
        title="Audit Log Details"
        description="Audit log details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default AuditLogDetails;
