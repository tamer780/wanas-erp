import api from "../api/axios";
import endpoints from "../api/endpoints";

const landsService = {
  getAll: (params) => api.get(endpoints.lands.list, { params }),
  create: (data) => api.post(endpoints.lands.create, data),
  getById: (id) => api.get(endpoints.lands.byId(id)),
  update: (id, data) => api.put(endpoints.lands.byId(id), data),
  remove: (id) => api.delete(endpoints.lands.byId(id)),
  getCosts: (id, params) => api.get(endpoints.lands.costs(id), { params }),
};

export default landsService;
