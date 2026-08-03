import api from "../api/axios";
import endpoints from "../api/endpoints";

const financialTransactionsService = {
  getAll: (params) => api.get(endpoints.financialTransactions.list, { params }),
  create: (data) => api.post(endpoints.financialTransactions.create, data),
  void: (id, data) => api.post(endpoints.financialTransactions.void(id), data),
};

export default financialTransactionsService;
