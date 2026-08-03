import api from "../api/axios";
import endpoints from "../api/endpoints";

const paymentSchedulesService = {
  getAll: (params) => api.get(endpoints.paymentSchedules.list, { params }),
  create: (data) => api.post(endpoints.paymentSchedules.create, data),
  getById: (id) => api.get(endpoints.paymentSchedules.byId(id)),
  update: (id, data) => api.put(endpoints.paymentSchedules.byId(id), data),
  remove: (id) => api.delete(endpoints.paymentSchedules.byId(id)),
  pay: (id, data) => api.post(endpoints.paymentSchedules.pay(id), data),
};

export default paymentSchedulesService;
