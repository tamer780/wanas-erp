import api from "../api/axios";
import endpoints from "../api/endpoints";

const unitsService = {
  getAll: (params) => api.get(endpoints.units.list, { params }),
  create: (data) => api.post(endpoints.units.create, data),
  getById: (id) => api.get(endpoints.units.byId(id)),
  update: (id, data) => api.put(endpoints.units.byId(id), data),
  remove: (id) => api.delete(endpoints.units.byId(id)),
  getCosts: (id, params) => api.get(endpoints.units.costs(id), { params }),
};

export default unitsService;
