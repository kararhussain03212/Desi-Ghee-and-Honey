export const normalizeUserRole = (value) => {
  const role = String(value || "").trim().toLowerCase();
  if (role === "admin" || role === "super_admin") return "admin";
  return "editor";
};
