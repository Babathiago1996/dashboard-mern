import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5008/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");

  // Do NOT attach token on login
  if (!cfg.url.includes("/auth/login") && token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  return cfg;
});

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
};

export const leadsAPI = {
  create: (data) => api.post("/leads", data),
  getAll: (params) => api.get("/leads", { params }),
  exportCSV: () => api.get("/leads/export/csv", { responseType: "blob" }),
};

export default api;
