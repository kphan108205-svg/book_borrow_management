import api from "./api.service.js";

export async function getSachList(params = {}) {
	const response = await api.get("/sach", { params });

	return response.data;
}

export async function getSachById(maSach) {
	const response = await api.get(`/sach/${maSach}`);

	return response.data;
}

export async function createSach(data) {
	const response = await api.post("/sach", data);

	return response.data;
}

export async function updateSach(maSach, data) {
	const response = await api.put(`/sach/${maSach}`, data);

	return response.data;
}

export async function deleteSach(maSach) {
	const response = await api.delete(`/sach/${maSach}`);

	return response.data;
}
