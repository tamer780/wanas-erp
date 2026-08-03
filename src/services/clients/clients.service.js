import api from "../api/axios";
import endpoints from "../api/endpoints";

const clientsService = {
  getAll: (params) => api.get(endpoints.clients.list, { params }),
  create: (data) => api.post(endpoints.clients.create, data),
  getById: (id) => api.get(endpoints.clients.byId(id)),
  update: (id, data) => api.put(endpoints.clients.byId(id), data),
  remove: (id) => api.delete(endpoints.clients.byId(id)),
};

export default clientsService;
