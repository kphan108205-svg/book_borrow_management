<script setup>
import { computed, onMounted, ref } from "vue";

import { getSachList, deleteSach } from "../services/sach.service.js";

const sachList = ref([]);
const searchKeyword = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const deletingMaSach = ref("");

const pagination = ref({
	page: 1,
	limit: 10,
	totalItems: 0,
	totalPages: 0,
});

const displayedTotalPages = computed(() => {
	return Math.max(pagination.value.totalPages, 1);
});

function formatCurrency(value) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(value);
}

async function loadSach() {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		const result = await getSachList({
			page: pagination.value.page,
			limit: pagination.value.limit,
			search: searchKeyword.value.trim(),
		});

		sachList.value = result.data;
		pagination.value = result.pagination;
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải danh sách sách";
	} finally {
		isLoading.value = false;
	}
}

async function handleSearch() {
	pagination.value.page = 1;
	await loadSach();
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
	await loadSach();
}

async function handleDelete(sach) {
	const confirmed = window.confirm(
		`Bạn có chắc muốn xóa sách "${sach.TenSach}" không?`,
	);

	if (!confirmed) {
		return;
	}

	deletingMaSach.value = sach.MaSach;
	errorMessage.value = "";

	try {
		await deleteSach(sach.MaSach);

		await loadSach();

		if (sachList.value.length === 0 && pagination.value.page > 1) {
			pagination.value.page -= 1;
			await loadSach();
		}
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message || "Không thể xóa sách. Vui lòng thử lại.";
	} finally {
		deletingMaSach.value = "";
	}
}

onMounted(() => {
	loadSach();
});
</script>

<template>
	<main class="container-fluid px-4 py-4">
		<div
			class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
		>
			<div>
				<h1 class="h3 mb-1">Quản lý sách</h1>

				<p class="text-secondary mb-0">
					Tìm kiếm và theo dõi sách trong thư viện
				</p>
			</div>

			<RouterLink :to="{ name: 'sach-create' }" class="btn btn-primary">
				<i class="fa-solid fa-plus me-2"></i>
				Thêm sách
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
							placeholder="Tìm theo mã, tên sách hoặc tác giả"
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

					<p class="text-secondary mt-3 mb-0">Đang tải danh sách sách...</p>
				</div>

				<div v-else class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th>Mã sách</th>
								<th>Tên sách</th>
								<th>Tác giả/Nguồn gốc</th>
								<th>Nhà xuất bản</th>
								<th>Năm xuất bản</th>
								<th class="text-end">Đơn giá</th>
								<th class="text-end">Số quyển</th>
								<th>Thao tác</th>
							</tr>
						</thead>

						<tbody>
							<tr v-for="sach in sachList" :key="sach._id">
								<td class="fw-semibold">
									{{ sach.MaSach }}
								</td>

								<td>
									{{ sach.TenSach }}
								</td>

								<td>
									{{ sach.NguonGocTacGia }}
								</td>

								<td>
									{{ sach.MaNXB }}
								</td>

								<td>
									{{ sach.NamXuatBan }}
								</td>

								<td class="text-end">
									{{ formatCurrency(sach.DonGia) }}
								</td>

								<td class="text-end">
									{{ sach.SoQuyen }}
								</td>

								<td>
									<div class="d-flex gap-2">
										<RouterLink
											:to="{
												name: 'sach-edit',
												params: {
													maSach: sach.MaSach,
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
											:disabled="deletingMaSach === sach.MaSach"
											@click="handleDelete(sach)"
										>
											<i class="fa-solid fa-trash me-1"></i>

											{{
												deletingMaSach === sach.MaSach ? "Đang xóa..." : "Xóa"
											}}
										</button>
									</div>
								</td>
							</tr>

							<tr v-if="sachList.length === 0">
								<td colspan="7" class="py-5 text-center text-secondary">
									Không tìm thấy sách phù hợp
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
						sách
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
	</main>
</template>
