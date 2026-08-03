import { CalendarClock } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const PaymentScheduleDetails = () => {
  return (
    <PageScaffold
      title="Payment Schedule Details"
      description="View detailed information for this payment schedule."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Payment Schedules", to: "/payment-schedules" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={CalendarClock}
        title="Payment Schedule Details"
        description="Payment Schedule details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default PaymentScheduleDetails;
