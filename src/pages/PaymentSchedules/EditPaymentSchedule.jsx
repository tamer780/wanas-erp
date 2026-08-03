import { CalendarClock } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditPaymentSchedule = () => {
  return (
    <PageScaffold
      title="Edit Payment Schedule"
      description="Update payment schedule information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Payment Schedules", to: "/payment-schedules" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={CalendarClock}
        title="Edit Payment Schedule"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditPaymentSchedule;
