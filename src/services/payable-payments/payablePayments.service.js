import api from "../api/axios";
import endpoints from "../api/endpoints";

const payablePaymentsService = {
  getAll: (params) => api.get(endpoints.payablePayments.list, { params }),
  create: (data) => api.post(endpoints.payablePayments.create, data),
};

export default payablePaymentsService;
