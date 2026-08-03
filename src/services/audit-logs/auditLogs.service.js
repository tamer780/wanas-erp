import api from "../api/axios";
import endpoints from "../api/endpoints";

const auditLogsService = {
  getAll: (params) => api.get(endpoints.auditLogs.list, { params }),
  getById: (id) => api.get(endpoints.auditLogs.byId(id)),
};

export default auditLogsService;
