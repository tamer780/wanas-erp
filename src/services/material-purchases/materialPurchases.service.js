import api from "../api/axios";
import endpoints from "../api/endpoints";

const materialPurchasesService = {
  getAll: (params) => api.get(endpoints.materialPurchases.list, { params }),
  create: (data) => api.post(endpoints.materialPurchases.create, data),
  getById: (id) => api.get(endpoints.materialPurchases.byId(id)),
  update: (id, data) => api.put(endpoints.materialPurchases.byId(id), data),
  remove: (id) => api.delete(endpoints.materialPurchases.byId(id)),
};

export default materialPurchasesService;
