<script setup>
import { computed, onMounted, ref } from "vue";

import {
	getTheoDoiMuonSachList,
	returnBorrowedBook,
} from "../services/theo-doi-muon-sach.service.js";

const theoDoiMuonSachList = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const returningId = ref("");
const searchKeyword = ref("");
const statusFilter = ref("");

const pagination = ref({
	page: 1,
	limit: 10,
	totalItems: 0,
	totalPages: 0,
});

const displayedTotalPages = computed(() => {
	return Math.max(pagination.value.totalPages, 1);
});

function formatDate(dateValue) {
	if (!dateValue) {
		return "Chưa trả";
	}

	return new Intl.DateTimeFormat("vi-VN").format(new Date(dateValue));
}

function getTrangThaiLabel(trangThai) {
	switch (trangThai) {
		case "dang-muon":
			return "Đang mượn";
		case "da-tra":
			return "Đã trả";
		case "qua-han":
			return "Quá hạn";
		default:
			return trangThai;
	}
}

function getTrangThaiClass(trangThai) {
	switch (trangThai) {
		case "dang-muon":
			return "text-bg-primary";
		case "da-tra":
			return "text-bg-success";
		case "qua-han":
			return "text-bg-danger";
		default:
			return "text-bg-secondary";
	}
}

async function loadTheoDoiMuonSach() {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		const params = {
			page: pagination.value.page,
			limit: pagination.value.limit,
			search: searchKeyword.value.trim(),
		};

		if (statusFilter.value) {
			params.status = statusFilter.value;
		}

		const result = await getTheoDoiMuonSachList(params);

		theoDoiMuonSachList.value = result.data;
		pagination.value = result.pagination;
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải dữ liệu mượn sách";
	} finally {
		isLoading.value = false;
	}
}

async function handleSearch() {
	pagination.value.page = 1;
	await loadTheoDoiMuonSach();
}

async function handleStatusChange() {
	pagination.value.page = 1;
	await loadTheoDoiMuonSach();
}

async function changePage(newPage) {
	if (
		newPage < 1 ||
		newPage > pagination.value.totalPages ||
		newPage === pagination.value.page
	) {
		return;
	}

	pagination.value.page = newPage;
	await loadTheoDoiMuonSach();
}

async function handleReturnBook(phieuMuon) {
	const tenSach = phieuMuon.ThongTinSach?.TenSach ?? phieuMuon.MaSach;

	const confirmed = window.confirm(`Xác nhận độc giả đã trả sách "${tenSach}"`);

	if (!confirmed) {
		return;
	}

	returningId.value = phieuMuon._id;
	errorMessage.value = "";

	try {
		await returnBorrowedBook(phieuMuon._id);
		await loadTheoDoiMuonSach();

		if (theoDoiMuonSachList.value.length === 0 && pagination.value.page > 1) {
			pagination.value.page -= 1;
			await loadTheoDoiMuonSach();
		}
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể xác nhận trả sách";
	} finally {
		returningId.value = "";
	}
}

onMounted(() => {
	loadTheoDoiMuonSach();
});
</script>

<template>
	<div>
		<div
			class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
		>
			<div>
				<h1 class="h3 mb-1">Theo dõi mượn sách</h1>

				<p class="text-secondary mb-0">Danh sách các lượt mượn và trả sách</p>
			</div>

			<RouterLink :to="{ name: 'phieu-muon-create' }" class="btn btn-primary">
				<i class="fa-solid fa-plus me-2"></i>
				Lập phiếu mượn
			</RouterLink>
		</div>

		<div v-if="errorMessage" class="alert alert-danger">
			{{ errorMessage }}
		</div>

		<section class="card border-0 shadow-sm">
			<div class="card-body">
				<form class="row g-2 mb-4" @submit.prevent="handleSearch">
					<div class="col-md-5 col-lg-5">
						<input
							v-model="searchKeyword"
							type="search"
							class="form-control"
							placeholder="Tìm theo mã độc giả, mã sách hoặc tên..."
						/>
					</div>

					<div class="col-md-4 col-lg-3">
						<select
							v-model="statusFilter"
							class="form-select"
							:disabled="isLoading"
							@change="handleStatusChange"
						>
							<option value="">Tất cả trạng thái</option>
							<option value="dang-muon">Đang mượn</option>
							<option value="da-tra">Đã trả</option>
							<option value="qua-han">Quá hạn</option>
						</select>
					</div>

					<div class="col-auto">
						<button
							type="submit"
							class="btn btn-outline-primary"
							:disabled="isLoading"
						>
							<i class="fa-solid fa-magnifying-glass me-2"></i>
							Tìm kiếm
						</button>
					</div>
				</form>

				<div v-if="isLoading" class="py-5 text-center">
					<div class="spinner-border text-primary" role="status"></div>

					<p class="text-secondary mt-3 mb-0">Đang tải dữ liệu mượn sách</p>
				</div>

				<div v-else class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th>Độc giả</th>
								<th>Sách</th>
								<th>Nhân viên</th>
								<th>Ngày mượn</th>
								<th>Hạn trả</th>
								<th>Ngày trả</th>
								<th>Trạng thái</th>
								<th>Thao tác</th>
							</tr>
						</thead>

						<tbody>
							<tr v-for="phieuMuon in theoDoiMuonSachList" :key="phieuMuon._id">
								<td>
									<div class="fw-semibold">
										{{ phieuMuon.ThongTinDocGia?.HoLot }}
										{{ phieuMuon.ThongTinDocGia?.Ten }}
									</div>

									<small class="text-secondary">
										{{ phieuMuon.MaDocGia }}
									</small>
								</td>

								<td>
									<div class="fw-semibold">
										{{ phieuMuon.ThongTinSach?.TenSach }}
									</div>

									<small class="text-secondary">
										{{ phieuMuon.MaSach }}
									</small>
								</td>

								<td>
									<div>
										{{ phieuMuon.ThongTinNhanVien?.HoTenNV }}
									</div>

									<small class="text-secondary">
										{{ phieuMuon.MSNV }}
									</small>
								</td>

								<td>
									{{ formatDate(phieuMuon.NgayMuon) }}
								</td>

								<td>
									{{ formatDate(phieuMuon.HanTra) }}
								</td>

								<td>
									{{ formatDate(phieuMuon.NgayTra) }}
								</td>

								<td>
									<span
										class="badge"
										:class="getTrangThaiClass(phieuMuon.TrangThai)"
									>
										{{ getTrangThaiLabel(phieuMuon.TrangThai) }}
									</span>
								</td>

								<td>
									<button
										v-if="phieuMuon.TrangThai !== 'da-tra'"
										type="button"
										class="btn btn-sm btn-success"
										:disabled="returningId === phieuMuon._id"
										@click="handleReturnBook(phieuMuon)"
									>
										<span
											v-if="returningId === phieuMuon._id"
											class="spinner-border spinner-border-sm me-1"
											role="status"
										></span>

										<i v-else class="fa-solid fa-rotate-left me-1"></i>

										{{
											returningId === phieuMuon._id
												? "Đang xử lý..."
												: "Trả sách"
										}}
									</button>

									<span v-else class="small text-secondary"> Đã hoàn tất </span>
								</td>
							</tr>

							<tr v-if="theoDoiMuonSachList.length === 0">
								<td colspan="8" class="py-5 text-center text-secondary">
									Không có lượt mượn sách nào
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div
					class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-4"
				>
					<small class="text-secondary">
						Tổng cộng {{ pagination.totalItems }} lượt mượn sách
					</small>

					<div class="d-flex align-items-center gap-2">
						<button
							type="button"
							class="btn btn-sm btn-outline-secondary"
							:disabled="isLoading || pagination.page <= 1"
							@click="changePage(pagination.page - 1)"
						>
							Trước
						</button>

						<span class="small">
							Trang
							{{ pagination.page }}
							/
							{{ displayedTotalPages }}
						</span>

						<button
							type="button"
							class="btn btn-sm btn-outline-secondary"
							:disabled="isLoading || pagination.page >= pagination.totalPages"
							@click="changePage(pagination.page + 1)"
						>
							Sau
						</button>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
