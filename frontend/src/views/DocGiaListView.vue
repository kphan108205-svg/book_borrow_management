<script setup>
import { computed, onMounted, ref } from "vue";

import { getDocGiaList, deleteDocGia } from "../services/doc-gia.service.js";

const docGiaList = ref([]);
const searchKeyword = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const deletingMaDocGia = ref("");

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
		return "";
	}

	return new Intl.DateTimeFormat("vi-VN").format(new Date(dateValue));
}

async function loadDocGia() {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		const result = await getDocGiaList({
			page: pagination.value.page,
			limit: pagination.value.limit,
			search: searchKeyword.value.trim(),
		});

		docGiaList.value = result.data;
		pagination.value = result.pagination;
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải danh sách độc giả";
	} finally {
		isLoading.value = false;
	}
}

async function handleSearch() {
	pagination.value.page = 1;
	await loadDocGia();
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
	await loadDocGia();
}

async function handleDelete(docGia) {
	const hoTen = `${docGia.HoLot} ${docGia.Ten}`.trim();

	const confirmed = window.confirm(
		`Bạn có chắc muốn xóa độc giả "${hoTen}" không?`,
	);

	if (!confirmed) {
		return;
	}

	deletingMaDocGia.value = docGia.MaDocGia;
	errorMessage.value = "";

	try {
		await deleteDocGia(docGia.MaDocGia);

		await loadDocGia();

		if (docGiaList.value.length === 0 && pagination.value.page > 1) {
			pagination.value.page -= 1;
			await loadDocGia();
		}
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ??
			"Không thể xóa độc giả. Vui lòng thử lại.";
	} finally {
		deletingMaDocGia.value = "";
	}
}

onMounted(() => {
	loadDocGia();
});
</script>

<template>
	<div>
		<div
			class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
		>
			<div>
				<h1 class="h3 mb-1">Quản lý độc giả</h1>

				<p class="text-secondary mb-0">
					Tìm kiếm và theo dõi độc giả của thư viện
				</p>
			</div>

			<RouterLink :to="{ name: 'doc-gia-create' }" class="btn btn-primary">
				<i class="fa-solid fa-plus me-2"></i>
				Thêm độc giả
			</RouterLink>
		</div>

		<section class="card border-0 shadow-sm">
			<div class="card-body">
				<form class="row g-2 mb-4" @submit.prevent="handleSearch">
					<div class="col-md-8 col-lg-6">
						<input
							v-model="searchKeyword"
							type="search"
							class="form-control"
							placeholder="Tìm theo mã, họ tên hoặc số điện thoại"
						/>
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

				<div v-if="errorMessage" class="alert alert-danger">
					{{ errorMessage }}
				</div>

				<div v-if="isLoading" class="py-5 text-center">
					<div class="spinner-border text-primary" role="status"></div>

					<p class="text-secondary mt-3 mb-0">Đang tải danh sách độc giả...</p>
				</div>

				<div v-else class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th>Mã độc giả</th>
								<th>Họ và tên</th>
								<th>Ngày sinh</th>
								<th>Phái</th>
								<th>Địa chỉ</th>
								<th>Điện thoại</th>
								<th>Thao tác</th>
							</tr>
						</thead>

						<tbody>
							<tr v-for="docGia in docGiaList" :key="docGia._id">
								<td class="fw-semibold">
									{{ docGia.MaDocGia }}
								</td>

								<td>
									{{ docGia.HoLot }}
									{{ docGia.Ten }}
								</td>

								<td>
									{{ formatDate(docGia.NgaySinh) }}
								</td>

								<td>
									{{ docGia.Phai }}
								</td>

								<td>
									{{ docGia.DiaChi }}
								</td>

								<td>
									{{ docGia.DienThoai }}
								</td>

								<td>
									<div class="d-flex gap-2">
										<RouterLink
											:to="{
												name: 'doc-gia-edit',
												params: {
													maDocGia: docGia.MaDocGia,
												},
											}"
											class="btn btn-sm btn-outline-primary"
										>
											<i class="fa-solid fa-pen-to-square me-1"></i>
											Sửa
										</RouterLink>

										<button
											type="button"
											class="btn btn-sm btn-outline-danger"
											:disabled="deletingMaDocGia === docGia.MaDocGia"
											@click="handleDelete(docGia)"
										>
											<i class="fa-solid fa-trash me-1"></i>

											{{
												deletingMaDocGia === docGia.MaDocGia
													? "Đang xóa..."
													: "Xóa"
											}}
										</button>
									</div>
								</td>
							</tr>

							<tr v-if="docGiaList.length === 0">
								<td colspan="7" class="py-5 text-center text-secondary">
									Không tìm thấy độc giả phù hợp
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div
					class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-4"
				>
					<small class="text-secondary">
						Tổng cộng
						{{ pagination.totalItems }}
						độc giả
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
