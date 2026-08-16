import api from "./api.service.js";

export async function getDocGiaList(params = {}) {
	const response = await api.get("/doc-gia", {
		params,
	});

	return response.data;
}

export async function getDocGiaById(maDocGia) {
	const response = await api.get(`/doc-gia/${maDocGia}`);

	return response.data;
}

export async function createDocGia(data) {
	const response = await api.post("/doc-gia", data);

	return response.data;
}

export async function updateDocGia(maDocGia, data) {
	const response = await api.put(`/doc-gia/${maDocGia}`, data);

	return response.data;
}

export async function deleteDocGia(maDocGia) {
	const response = await api.delete(`/doc-gia/${maDocGia}`);

	return response.data;
}
