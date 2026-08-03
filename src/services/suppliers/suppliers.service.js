import api from "../api/axios";
import endpoints from "../api/endpoints";

const suppliersService = {
  getAll: (params) => api.get(endpoints.suppliers.list, { params }),
  create: (data) => api.post(endpoints.suppliers.create, data),
  getById: (id) => api.get(endpoints.suppliers.byId(id)),
  update: (id, data) => api.put(endpoints.suppliers.byId(id), data),
  remove: (id) => api.delete(endpoints.suppliers.byId(id)),
};

export default suppliersService;
