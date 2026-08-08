import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound/NotFound";

import Users from "../pages/Users/Users";
import UserDetails from "../pages/Users/UserDetails";
import CreateUser from "../pages/Users/CreateUser";
import EditUser from "../pages/Users/EditUser";

import Lands from "../pages/Lands/Lands";
import LandDetails from "../pages/Lands/LandDetails";
import CreateLand from "../pages/Lands/CreateLand";
import EditLand from "../pages/Lands/EditLand";

import Buildings from "../pages/Buildings/Buildings";
import BuildingDetails from "../pages/Buildings/BuildingDetails";
import CreateBuilding from "../pages/Buildings/CreateBuilding";
import EditBuilding from "../pages/Buildings/EditBuilding";

import Units from "../pages/Units/Units";
import UnitDetails from "../pages/Units/UnitDetails";
import CreateUnit from "../pages/Units/CreateUnit";
import EditUnit from "../pages/Units/EditUnit";

import Clients from "../pages/Clients/Clients";
import ClientDetails from "../pages/Clients/ClientDetails";
import CreateClient from "../pages/Clients/CreateClient";
import EditClient from "../pages/Clients/EditClient";

import Contractors from "../pages/Contractors/Contractors";
import ContractorDetails from "../pages/Contractors/ContractorDetails";
import CreateContractor from "../pages/Contractors/CreateContractor";
import EditContractor from "../pages/Contractors/EditContractor";

import Suppliers from "../pages/Suppliers/Suppliers";
import SupplierDetails from "../pages/Suppliers/SupplierDetails";
import CreateSupplier from "../pages/Suppliers/CreateSupplier";
import EditSupplier from "../pages/Suppliers/EditSupplier";

import WorkItems from "../pages/WorkItems/WorkItems";
import WorkItemDetails from "../pages/WorkItems/WorkItemDetails";
import CreateWorkItem from "../pages/WorkItems/CreateWorkItem";
import EditWorkItem from "../pages/WorkItems/EditWorkItem";

import MaterialPurchases from "../pages/MaterialPurchases/MaterialPurchases";
import MaterialPurchaseDetails from "../pages/MaterialPurchases/MaterialPurchaseDetails";
import CreateMaterialPurchase from "../pages/MaterialPurchases/CreateMaterialPurchase";
import EditMaterialPurchase from "../pages/MaterialPurchases/EditMaterialPurchase";

import UnitSales from "../pages/UnitSales/UnitSales";
import UnitSaleDetails from "../pages/UnitSales/UnitSaleDetails";
import CreateUnitSale from "../pages/UnitSales/CreateUnitSale";
import EditUnitSale from "../pages/UnitSales/EditUnitSale";

import PaymentSchedules from "../pages/PaymentSchedules/PaymentSchedules";
import PaymentScheduleDetails from "../pages/PaymentSchedules/PaymentScheduleDetails";
import CreatePaymentSchedule from "../pages/PaymentSchedules/CreatePaymentSchedule";
import EditPaymentSchedule from "../pages/PaymentSchedules/EditPaymentSchedule";

import PayablePayments from "../pages/PayablePayments/PayablePayments";
import CreatePayablePayment from "../pages/PayablePayments/CreatePayablePayment";

import FinancialTransactions from "../pages/FinancialTransactions/FinancialTransactions";
import FinancialTransactionDetails from "../pages/FinancialTransactions/FinancialTransactionDetails";
import CreateFinancialTransaction from "../pages/FinancialTransactions/CreateFinancialTransaction";

import Reports from "../pages/Reports/Reports";

import AuditLogs from "../pages/AuditLogs/AuditLogs";
import AuditLogDetails from "../pages/AuditLogs/AuditLogDetails";

const crudRoutes = (base, { List, Create, Details, Edit }) => [
  { path: base, Component: List },
  { path: `${base}/create`, Component: Create },
  { path: `${base}/:id`, Component: Details },
  { path: `${base}/:id/edit`, Component: Edit },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    Component: AuthLayout,
    children: [{ index: true, Component: Login }],
  },
  {
    Component: DashboardLayout,
    children: [
      { path: "/dashboard", Component: Dashboard },

      ...crudRoutes("/users", {
        List: Users,
        Create: CreateUser,
        Details: UserDetails,
        Edit: EditUser,
      }),
      ...crudRoutes("/lands", {
        List: Lands,
        Create: CreateLand,
        Details: LandDetails,
        Edit: EditLand,
      }),
      ...crudRoutes("/buildings", {
        List: Buildings,
        Create: CreateBuilding,
        Details: BuildingDetails,
        Edit: EditBuilding,
      }),
      ...crudRoutes("/units", {
        List: Units,
        Create: CreateUnit,
        Details: UnitDetails,
        Edit: EditUnit,
      }),
      ...crudRoutes("/clients", {
        List: Clients,
        Create: CreateClient,
        Details: ClientDetails,
        Edit: EditClient,
      }),
      ...crudRoutes("/contractors", {
        List: Contractors,
        Create: CreateContractor,
        Details: ContractorDetails,
        Edit: EditContractor,
      }),
      ...crudRoutes("/suppliers", {
        List: Suppliers,
        Create: CreateSupplier,
        Details: SupplierDetails,
        Edit: EditSupplier,
      }),
      ...crudRoutes("/work-items", {
        List: WorkItems,
        Create: CreateWorkItem,
        Details: WorkItemDetails,
        Edit: EditWorkItem,
      }),
      ...crudRoutes("/material-purchases", {
        List: MaterialPurchases,
        Create: CreateMaterialPurchase,
        Details: MaterialPurchaseDetails,
        Edit: EditMaterialPurchase,
      }),
      ...crudRoutes("/unit-sales", {
        List: UnitSales,
        Create: CreateUnitSale,
        Details: UnitSaleDetails,
        Edit: EditUnitSale,
      }),
      ...crudRoutes("/payment-schedules", {
        List: PaymentSchedules,
        Create: CreatePaymentSchedule,
        Details: PaymentScheduleDetails,
        Edit: EditPaymentSchedule,
      }),

      { path: "/payable-payments", Component: PayablePayments },
      { path: "/payable-payments/create", Component: CreatePayablePayment },

      {
        path: "/financial-transactions",
        Component: FinancialTransactions,
      },
      {
        path: "/financial-transactions/create",
        Component: CreateFinancialTransaction,
      },
      {
        path: "/financial-transactions/:id",
        Component: FinancialTransactionDetails,
      },

      { path: "/reports", Component: Reports },
      {
        path: "/reports/income-expense",
        element: <Navigate to="/reports" replace />,
      },

      { path: "/audit-logs", Component: AuditLogs },
      { path: "/audit-logs/:id", Component: AuditLogDetails },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
