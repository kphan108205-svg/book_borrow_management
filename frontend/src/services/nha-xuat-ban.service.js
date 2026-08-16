import api from "./api.service";

export async function getNhaXuatBanList(params = {}) {
	const response = await api.get("/nha-xuat-ban", { params });

	return response.data;
}
