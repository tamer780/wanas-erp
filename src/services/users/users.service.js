import api from "../api/axios";
import endpoints from "../api/endpoints";

const usersService = {
  getAll: (params) => api.get(endpoints.users.list, { params }),
  create: (data) => api.post(endpoints.users.create, data),
  getById: (id) => api.get(endpoints.users.byId(id)),
  update: (id, data) => api.put(endpoints.users.byId(id), data),
  remove: (id) => api.delete(endpoints.users.byId(id)),
};

export default usersService;
