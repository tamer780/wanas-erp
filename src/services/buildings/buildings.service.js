import api from "../api/axios";
import endpoints from "../api/endpoints";

const buildingsService = {
  getAll: (params) => api.get(endpoints.buildings.list, { params }),
  create: (data) => api.post(endpoints.buildings.create, data),
  getById: (id) => api.get(endpoints.buildings.byId(id)),
  update: (id, data) => api.put(endpoints.buildings.byId(id), data),
  remove: (id) => api.delete(endpoints.buildings.byId(id)),
  getCosts: (id, params) => api.get(endpoints.buildings.costs(id), { params }),
};

export default buildingsService;
