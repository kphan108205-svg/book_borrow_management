import api from "../services/api.service.js";

export async function getNhanVienList(params = {}) {
	const response = await api.get("/nhan-vien", { params });

	return response.data;
}

export async function getNhanVienById(msnv) {
	const response = await api.get(`/nhan-vien/${msnv}`);

	return response.data;
}

export async function createNhanVien(data) {
	const response = await api.post("/nhan-vien", data);

	return response.data;
}

export async function updateNhanVien(msnv, data) {
	const response = await api.put(`/nhan-vien/${msnv}`, data);

	return response.data;
}

export async function deleteNhanVien(msnv) {
	const response = await api.delete(`/nhan-vien/${msnv}`);

	return response.data;
}

export async function changePassword(msnv, data) {
	const response = await api.put(`/nhan-vien/${msnv}/password`, data);

	return response.data;
}
