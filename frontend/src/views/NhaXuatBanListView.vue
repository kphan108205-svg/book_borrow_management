<script setup>
import { onMounted, computed, ref } from "vue";

import {
	getNhaXuatBanList,
	deleteNhaXuatBan,
} from "../services/nha-xuat-ban.service.js";

const nhaXuatBanList = ref([]);
const searchKeyword = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const deletingMaNXB = ref("");

const pagination = ref({
	page: 1,
	limit: 10,
	totalItems: 0,
	totalPages: 0,
});

const displayedTotalPages = computed(() => {
	return Math.max(pagination.value.totalPages, 1);
});

async function loadNhaXuatBan() {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		const result = await getNhaXuatBanList({
			page: pagination.value.page,
			limit: pagination.value.limit,
			search: searchKeyword.value.trim(),
		});

		nhaXuatBanList.value = result.data;
		pagination.value = result.pagination;
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải danh sách nhà xuất bản";
	} finally {
		isLoading.value = false;
	}
}

async function handleSearch() {
	pagination.value.page = 1;
	await loadNhaXuatBan();
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
	await loadNhaXuatBan();
}

async function handleDelete(nhaXuatBan) {
	const confirmed = window.confirm(
		`Bạn có chắc muốn xóa nhà xuất bản "${nhaXuatBan.TenNXB}" không?`,
	);

	if (!confirmed) {
		return;
	}

	deletingMaNXB.value = nhaXuatBan.MaNXB;
	errorMessage.value = "";

	try {
		await deleteNhaXuatBan(nhaXuatBan.MaNXB);
		await loadNhaXuatBan();

		if (nhaXuatBanList.value.length === 0 && pagination.value.page > 1) {
			pagination.value.page -= 1;
			await loadNhaXuatBan();
		}
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể xóa nhà xuất bản";
	} finally {
		deletingMaNXB.value = "";
	}
}

onMounted(() => {
	loadNhaXuatBan();
});
</script>

<template>
	<div>
		<div
			class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
		>
			<div>
				<h1 class="h3 mb-1">Quản lý nhà xuất bản</h1>

				<p class="text-secondary mb-0">Tìm kiếm và theo dõi các nhà xuất bản</p>
			</div>

			<RouterLink :to="{ name: 'nha-xuat-ban-create' }" class="btn btn-primary">
				<i class="fa-solid fa-plus me-2"></i>
				Thêm nhà xuất bản
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
							placeholder="Tìm theo mã, tên hoặc địa chỉ"
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

					<p class="text-secondary mt-3 mb-0">
						Đang tải danh sách nhà xuất bản...
					</p>
				</div>

				<div v-else class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th>Mã nhà xuất bản</th>
								<th>Tên nhà xuất bản</th>
								<th>Địa chỉ</th>
								<th>Thao tác</th>
							</tr>
						</thead>

						<tbody>
							<tr v-for="nhaXuatBan in nhaXuatBanList" :key="nhaXuatBan.MaNXB">
								<td class="fw-semibold">
									{{ nhaXuatBan.MaNXB }}
								</td>

								<td>
									{{ nhaXuatBan.TenNXB }}
								</td>

								<td>
									{{ nhaXuatBan.DiaChi }}
								</td>

								<td>
									<div class="d-flex gap-2">
										<RouterLink
											:to="{
												name: 'nha-xuat-ban-edit',
												params: {
													maNXB: nhaXuatBan.MaNXB,
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
											:disabled="deletingMaNXB === nhaXuatBan.MaNXB"
											@click="handleDelete(nhaXuatBan)"
										>
											<i class="fa-solid fa-trash me-1"></i>

											{{
												deletingMaNXB === nhaXuatBan.MaNXB
													? "Đang xóa..."
													: "Xóa"
											}}
										</button>
									</div>
								</td>
							</tr>

							<tr v-if="nhaXuatBanList.length === 0">
								<td colspan="4" class="py-5 text-center text-secondary">
									Không tìm thấy nhà xuất bản phù hợp
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
						nhà xuất bản
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
