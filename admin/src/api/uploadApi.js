import api from "./axios";

export const uploadImage = async (file, folder = "misc") => {
  const payload = new FormData();
  payload.append("file", file);
  payload.append("folder", folder);

  const { data } = await api.post("/admin/upload", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data?.data?.path || "";
};
