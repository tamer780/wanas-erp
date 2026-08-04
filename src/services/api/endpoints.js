const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
  },

  users: {
    list: "/users",
    create: "/users",
    byId: (id) => `/users/${id}`,
  },

  lands: {
    list: "/lands",
    create: "/lands",
    byId: (id) => `/lands/${id}`,
    costs: (id) => `/lands/${id}/costs`,
  },

  buildings: {
    list: "/buildings",
    create: "/buildings",
    byId: (id) => `/buildings/${id}`,
    costs: (id) => `/buildings/${id}/costs`,
  },

  units: {
    list: "/units",
    create: "/units",
    byId: (id) => `/units/${id}`,
    costs: (id) => `/units/${id}/costs`,
  },

  suppliers: {
    list: "/suppliers",
    create: "/suppliers",
    byId: (id) => `/suppliers/${id}`,
  },

  contractors: {
    list: "/contractors",
    create: "/contractors",
    byId: (id) => `/contractors/${id}`,
  },

  clients: {
    list: "/clients",
    create: "/clients",
    byId: (id) => `/clients/${id}`,
  },

  workItems: {
    list: "/work-items",
    create: "/work-items",
    byId: (id) => `/work-items/${id}`,
  },

  materialPurchases: {
    list: "/material-purchases",
    create: "/material-purchases",
    byId: (id) => `/material-purchases/${id}`,
  },

  payablePayments: {
    list: "/payable-payments",
    create: "/payable-payments",
  },

  paymentSchedules: {
    list: "/payment-schedules",
    create: "/payment-schedules",
    byId: (id) => `/payment-schedules/${id}`,
    pay: (id) => `/payment-schedules/${id}/pay`,
  },

  unitSales: {
    list: "/unit-sales",
    create: "/unit-sales",
    byId: (id) => `/unit-sales/${id}`,
    contract: (id) => `/unit-sales/${id}/contract`,
    payments: (id) => `/unit-sales/${id}/payments`,
    installments: (id) => `/unit-sales/${id}/installments`,
  },

  financialTransactions: {
    list: "/financial-transactions",
    create: "/financial-transactions",
    void: (id) => `/financial-transactions/${id}/void`,
  },

  reports: {
    incomeExpense: "/reports/income-expense",
  },

  auditLogs: {
    list: "/audit-logs",
    byId: (id) => `/audit-logs/${id}`,
  },
};

export default endpoints;
