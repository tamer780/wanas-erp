import api from "../api/axios";
import endpoints from "../api/endpoints";

const authService = {
  login: (data) => api.post(endpoints.auth.login, data),
  logout: () => api.post(endpoints.auth.logout),
  me: () => api.get(endpoints.auth.me),
};

export default authService;
