import axios from "axios";

const api = axios.create({
  baseURL: "https://wanas.aljazeera-smart.com/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Placeholder: handle unauthorized / refresh-token logic here later.
    return Promise.reject(error);
  },
);

export default api;
