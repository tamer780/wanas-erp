import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const PaymentSchedules = () => {
  return (
    <PageScaffold
      title="Payment Schedules"
      description="Manage installment and payment schedules."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Payment Schedules" },
      ]}
      actions={
        <Link
          to="/payment-schedules/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Payment Schedule
        </Link>
      }
    >
      <EmptyState
        icon={CalendarClock}
        title="No Payment Schedules Found"
        description="Payment Schedules will appear here once they are created."
        actionLabel="Create Payment Schedule"
        actionTo="/payment-schedules/create"
      />
    </PageScaffold>
  );
};

export default PaymentSchedules;
