import api from "../api/axios";
import endpoints from "../api/endpoints";

const contractorsService = {
  getAll: (params) => api.get(endpoints.contractors.list, { params }),
  create: (data) => api.post(endpoints.contractors.create, data),
  getById: (id) => api.get(endpoints.contractors.byId(id)),
  update: (id, data) => api.put(endpoints.contractors.byId(id), data),
  remove: (id) => api.delete(endpoints.contractors.byId(id)),
};

export default contractorsService;
