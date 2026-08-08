import {
  LayoutDashboard,
  Map,
  Building2,
  DoorOpen,
  Users,
  Handshake,
  CalendarClock,
  Hammer,
  HardHat,
  Truck,
  Package,
  Wallet,
  Banknote,
  BarChart3,
  UserCog,
  ScrollText,
} from "lucide-react";

export const sidebarNavigation = [
  {
    id: "dashboard",
    items: [
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "real-estate",
    label: "Real Estate",
    items: [
      { label: "Lands", to: "/lands", icon: Map },
      { label: "Buildings", to: "/buildings", icon: Building2 },
      { label: "Units", to: "/units", icon: DoorOpen },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    items: [
      { label: "Clients", to: "/clients", icon: Users },
      { label: "Unit Sales", to: "/unit-sales", icon: Handshake },
      {
        label: "Payment Schedules",
        to: "/payment-schedules",
        icon: CalendarClock,
      },
    ],
  },
  {
    id: "construction",
    label: "Construction",
    items: [
      { label: "Work Items", to: "/work-items", icon: Hammer },
      { label: "Contractors", to: "/contractors", icon: HardHat },
      { label: "Suppliers", to: "/suppliers", icon: Truck },
      {
        label: "Material Purchases",
        to: "/material-purchases",
        icon: Package,
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        label: "Financial Transactions",
        to: "/financial-transactions",
        icon: Wallet,
      },
      {
        label: "Payable Payments",
        to: "/payable-payments",
        icon: Banknote,
      },
      { label: "Reports", to: "/reports", icon: BarChart3 },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      { label: "Users", to: "/users", icon: UserCog },
      { label: "Audit Logs", to: "/audit-logs", icon: ScrollText },
    ],
  },
];
