import api from "./axios";

export const loginApi = (payload) => api.post("/auth/login", payload);
export const meApi = () => api.get("/auth/me");
export const logoutApi = () => api.post("/auth/logout");
