import { Settings as SettingsIcon } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const Settings = () => {
  return (
    <PageScaffold
      title="Settings"
      description="Configure system preferences and account options."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Settings" },
      ]}
    >
      <EmptyState
        icon={SettingsIcon}
        title="Settings"
        description="Settings controls will appear here."
      />
    </PageScaffold>
  );
};

export default Settings;
