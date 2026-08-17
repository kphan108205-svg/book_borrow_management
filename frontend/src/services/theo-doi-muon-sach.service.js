import api from "./api.service.js";

export async function getTheoDoiMuonSachList(params = {}) {
	const response = await api.get("/theo-doi-muon-sach", {
		params,
	});

	return response.data;
}

export async function createPhieuMuon(data) {
	const response = await api.post("/theo-doi-muon-sach", data);

	return response.data;
}

export async function returnBorrowedBook(id) {
	const response = await api.patch(`/theo-doi-muon-sach/${id}/tra-sach`);

	return response.data;
}
