import api from "../api/axios";
import endpoints from "../api/endpoints";

const workItemsService = {
  getAll: (params) => api.get(endpoints.workItems.list, { params }),
  create: (data) => api.post(endpoints.workItems.create, data),
  getById: (id) => api.get(endpoints.workItems.byId(id)),
  update: (id, data) => api.put(endpoints.workItems.byId(id), data),
  remove: (id) => api.delete(endpoints.workItems.byId(id)),
};

export default workItemsService;
