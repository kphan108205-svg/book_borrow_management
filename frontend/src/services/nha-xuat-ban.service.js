import api from "./api.service";

export async function getNhaXuatBanList(params = {}) {
	const response = await api.get("/nha-xuat-ban", { params });

	return response.data;
}

export async function getNhaXuatBanById(maNXB) {
	const response = await api.get(`/nha-xuat-ban/${maNXB}`);

	return response.data;
}

export async function createNhaXuatBan(data) {
	const response = await api.post("/nha-xuat-ban", data);

	return response.data;
}

export async function updateNhaXuatBan(maNXB, data) {
	const response = await api.put(`/nha-xuat-ban/${maNXB}`, data);

	return response.data;
}

export async function deleteNhaXuatBan(maNXB) {
	const response = await api.delete(`/nha-xuat-ban/${maNXB}`);

	return response.data;
}
