import api from "../api/axios";
import endpoints from "../api/endpoints";

const unitSalesService = {
  getAll: (params) => api.get(endpoints.unitSales.list, { params }),
  create: (data) => api.post(endpoints.unitSales.create, data),
  getById: (id) => api.get(endpoints.unitSales.byId(id)),
  update: (id, data) => api.put(endpoints.unitSales.byId(id), data),
  remove: (id) => api.delete(endpoints.unitSales.byId(id)),
  getContract: (id) => api.get(endpoints.unitSales.contract(id)),
  getPayments: (id, params) =>
    api.get(endpoints.unitSales.payments(id), { params }),
  getInstallments: (id, params) =>
    api.get(endpoints.unitSales.installments(id), { params }),
};

export default unitSalesService;
