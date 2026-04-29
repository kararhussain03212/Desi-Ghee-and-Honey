import api from "./axios";

export const getTestimonials = () => api.get("/admin/testimonials?paginate=0");
export const getTestimonial = (id) => api.get(`/admin/testimonials/${id}`);
export const createTestimonial = (payload) => api.post("/admin/testimonials", payload);
export const updateTestimonial = (id, payload) => api.put(`/admin/testimonials/${id}`, payload);
export const deleteTestimonial = (id) => api.delete(`/admin/testimonials/${id}`);
