import { CalendarClock } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreatePaymentSchedule = () => {
  return (
    <PageScaffold
      title="Create Payment Schedule"
      description="Add a new payment schedule to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Payment Schedules", to: "/payment-schedules" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={CalendarClock}
        title="Create Payment Schedule"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreatePaymentSchedule;
