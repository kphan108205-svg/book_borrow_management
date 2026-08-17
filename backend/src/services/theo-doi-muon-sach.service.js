import { getDatabase } from "../configs/database.js";
import { escapeRegex } from "../utils/regex.js";

const COLLECTION_NAME = "TheoDoiMuonSach";

export async function findMuonSachById(id) {
	const database = getDatabase();

	return database.collection(COLLECTION_NAME).findOne({ _id: id });
}

export async function findAllMuonSach({ status, page, limit, search }) {
	const database = getDatabase();
	const collection = database.collection(COLLECTION_NAME);

	const now = new Date();

	const todayUTC = new Date(
		Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
	);

	const matchCondition = {};

	if (status === "dang-muon") {
		matchCondition.NgayTra = null;
		matchCondition.HanTra = {
			$gte: todayUTC,
		};
	}

	if (status === "da-tra") {
		matchCondition.NgayTra = {
			$ne: null,
		};
	}

	if (status === "qua-han") {
		matchCondition.NgayTra = null;
		matchCondition.HanTra = {
			$lt: todayUTC,
		};
	}

	const pipeline = [
		{
			$match: matchCondition,
		},
		{
			$lookup: {
				from: "DocGia",
				localField: "MaDocGia",
				foreignField: "MaDocGia",
				as: "DocGia",
			},
		},
		{
			$lookup: {
				from: "Sach",
				localField: "MaSach",
				foreignField: "MaSach",
				as: "Sach",
			},
		},
		{
			$lookup: {
				from: "NhanVien",
				localField: "MSNV",
				foreignField: "MSNV",
				as: "NhanVien",
			},
		},
		{
			$addFields: {
				TrangThai: {
					$switch: {
						branches: [
							{
								case: {
									$ne: ["$NgayTra", null],
								},
								then: "da-tra",
							},
							{
								case: {
									$lt: ["$HanTra", todayUTC],
								},
								then: "qua-han",
							},
						],
						default: "dang-muon",
					},
				},
			},
		},
	];

	if (search) {
		const searchPattern = new RegExp(escapeRegex(search), "i");

		pipeline.push({
			$match: {
				$or: [
					{
						MaDocGia: searchPattern,
					},
					{
						MaSach: searchPattern,
					},
					{
						MSNV: searchPattern,
					},
					{
						"DocGia.HoLot": searchPattern,
					},
					{
						"DocGia.Ten": searchPattern,
					},
					{
						"Sach.TenSach": searchPattern,
					},
					{
						"Sach.NguonGocTacGia": searchPattern,
					},
					{
						"NhanVien.HoTenNV": searchPattern,
					},
				],
			},
		});
	}

	const skip = (page - 1) * limit;

	pipeline.push(
		{
			$project: {
				_id: 1,
				MaDocGia: 1,
				MaSach: 1,
				MSNV: 1,
				NgayMuon: 1,
				HanTra: 1,
				NgayTra: 1,
				TrangThai: 1,
				ThongTinDocGia: {
					HoLot: {
						$arrayElemAt: ["$DocGia.HoLot", 0],
					},
					Ten: {
						$arrayElemAt: ["$DocGia.Ten", 0],
					},
				},
				ThongTinSach: {
					TenSach: {
						$arrayElemAt: ["$Sach.TenSach", 0],
					},
					NguonGocTacGia: {
						$arrayElemAt: ["$Sach.NguonGocTacGia", 0],
					},
				},
				ThongTinNhanVien: {
					HoTenNV: {
						$arrayElemAt: ["$NhanVien.HoTenNV", 0],
					},
					ChucVu: {
						$arrayElemAt: ["$NhanVien.ChucVu", 0],
					},
				},
			},
		},
		{
			$facet: {
				data: [
					{
						$sort: {
							NgayMuon: -1,
						},
					},
					{
						$skip: skip,
					},
					{
						$limit: limit,
					},
				],
				metadata: [
					{
						$count: "totalItems",
					},
				],
			},
		},
	);

	const [result] = await collection.aggregate(pipeline).toArray();

	const totalItems = result.metadata[0]?.totalItems ?? 0;

	return {
		data: result.data,
		pagination: {
			page,
			limit,
			totalItems,
			totalPages: Math.ceil(totalItems / limit),
		},
	};
}

export async function createMuonSach(muonSachData, msnv) {
	const database = getDatabase();

	const muonSachCollection = database.collection(COLLECTION_NAME);
	const docGiaCollection = database.collection("DocGia");
	const sachCollection = database.collection("Sach");
	const nhanVienCollection = database.collection("NhanVien");

	const docGia = await docGiaCollection.findOne({
		MaDocGia: muonSachData.MaDocGia,
	});

	if (!docGia) {
		return {
			status: "reader_not_found",
		};
	}

	const sach = await sachCollection.findOne({ MaSach: muonSachData.MaSach });

	if (!sach) {
		return {
			status: "book_not_found",
		};
	}

	const nhanVien = await nhanVienCollection.findOne({ MSNV: msnv });

	if (!nhanVien) {
		return {
			status: "employee_not_found",
		};
	}

	const luotMuonTrungSach = await muonSachCollection.findOne({
		MaDocGia: muonSachData.MaDocGia,
		MaSach: muonSachData.MaSach,
		NgayTra: null,
	});

	if (luotMuonTrungSach) {
		return {
			status: "already_borrowing",
		};
	}

	const sachDaGiam = await sachCollection.findOneAndUpdate(
		{
			MaSach: muonSachData.MaSach,
			SoQuyen: {
				$gt: 0,
			},
		},
		{
			$inc: {
				SoQuyen: -1,
			},
		},
		{
			returnDocument: "after",
		},
	);

	if (!sachDaGiam) {
		return {
			status: "out_of_stock",
		};
	}

	const luotMuonMoi = {
		MaDocGia: muonSachData.MaDocGia,
		MaSach: muonSachData.MaSach,
		MSNV: msnv,
		NgayMuon: muonSachData.NgayMuon,
		HanTra: muonSachData.HanTra,
		NgayTra: null,
	};

	try {
		const result = await muonSachCollection.insertOne(luotMuonMoi);

		return {
			status: "created",
			data: {
				_id: result.insertedId,
				...luotMuonMoi,
			},
		};
	} catch (error) {
		await sachCollection.updateOne(
			{
				MaSach: muonSachData.MaSach,
			},
			{
				$inc: {
					SoQuyen: 1,
				},
			},
		);

		throw error;
	}
}

export async function returnSach(id) {
	const database = getDatabase();
	const muonSachCollection = database.collection(COLLECTION_NAME);
	const sachCollection = database.collection("Sach");

	const luotMuon = await muonSachCollection.findOne({ _id: id });

	if (!luotMuon) {
		return {
			status: "not_found",
		};
	}

	if (luotMuon.NgayTra !== null) {
		return {
			status: "already_returned",
			data: luotMuon,
		};
	}

	const ngayTra = new Date();

	const updateMuonSach = await muonSachCollection.updateOne(
		{
			_id: id,
			NgayTra: null,
		},
		{
			$set: {
				NgayTra: ngayTra,
			},
		},
	);

	if (updateMuonSach.modifiedCount === 0) {
		return {
			status: "already_returned",
		};
	}

	try {
		const updateSach = await sachCollection.updateOne(
			{
				MaSach: luotMuon.MaSach,
			},
			{
				$inc: {
					SoQuyen: 1,
				},
			},
		);

		if (updateSach.matchedCount === 0) {
			throw new Error(
				`Không tìm thấy sách ${luotMuon.MaSach} khi xử lý trả sách`,
			);
		}
	} catch (error) {
		await muonSachCollection.updateOne(
			{
				_id: id,
				NgayTra: ngayTra,
			},
			{
				$set: {
					NgayTra: null,
				},
			},
		);

		throw error;
	}

	const luotMuonDaCapNhat = await muonSachCollection.findOne({ _id: id });

	return {
		status: "returned",
		data: luotMuonDaCapNhat,
	};
}
