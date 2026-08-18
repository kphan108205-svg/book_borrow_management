<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { getCurrentUser } from "../services/auth.service.js";

import {
	getNhanVienList,
	deleteNhanVien,
} from "../services/nhan-vien.service.js";

const currentUser = getCurrentUser();

const nhanVienList = ref([]);
const searchKeyword = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const deletingMSNV = ref("");

const pagination = ref({
	page: 1,
	limit: 10,
	totalItems: 0,
	totalPages: 0,
});

const displayedTotalPages = computed(() => {
	return Math.max(pagination.value.totalPages, 1);
});

async function loadNhanVien() {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		const result = await getNhanVienList({
			page: pagination.value.page,
			limit: pagination.value.limit,
			search: searchKeyword.value.trim(),
		});

		nhanVienList.value = result.data;
		pagination.value = result.pagination;
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải danh sách nhân viên";
	} finally {
		isLoading.value = false;
	}
}

async function handleSearch() {
	pagination.value.page = 1;
	await loadNhanVien();
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
	await loadNhanVien();
}

async function handleDelete(nhanVien) {
	if (nhanVien.MSNV === currentUser?.MSNV) {
		errorMessage.value = "Bạn không thể xóa tài khoản đang đăng nhập";
		return;
	}

	const confirmed = window.confirm(
		`Bạn có chắc muốn xóa nhân viên "${nhanVien.HoTenNV}" không`,
	);

	if (!confirmed) {
		return;
	}

	deletingMSNV.value = nhanVien.MSNV;
	errorMessage.value = "";

	try {
		await deleteNhanVien(nhanVien.MSNV);
		await loadNhanVien();

		if (nhanVienList.value.length === 0 && pagination.value.page > 1) {
			pagination.value.page -= 1;
			await loadNhanVien();
		}
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể xóa nhân viên";
	} finally {
		deletingMSNV.value = "";
	}
}

onMounted(() => {
	loadNhanVien();
});
</script>

<template>
	<div>
		<div
			class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
		>
			<div>
				<h1 class="h3 mb-1">Quản lý nhân viên</h1>

				<p class="text-secondary mb-0">
					Tìm kiếm và quản lý tài khoản nhân viên
				</p>
			</div>

			<RouterLink
				:to="{ name: 'nhan-vien-create' }"
				class="btn btn-primary"
			>
				<i class="fa-solid fa-plus me-2"></i>
				Thêm nhân viên
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

					<p class="text-secondary mt-3 mb-0">
						Đang tải danh sách nhân viên...
					</p>
				</div>

				<div v-else class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th>Mã nhân viên</th>
								<th>Họ và tên</th>
								<th>Chức vụ</th>
								<th>Địa chỉ</th>
								<th>Số điện thoại</th>
								<th>Thao tác</th>
							</tr>
						</thead>

						<tbody>
							<tr v-for="nhanVien in nhanVienList" :key="nhanVien.MSNV">
								<td class="fw-semibold">
									{{ nhanVien.MSNV }}

									<span
										v-if="nhanVien.MSNV === currentUser?.MSNV"
										class="badge text-bg-info ms-1"
									>
										Bạn
									</span>
								</td>

								<td>
									{{ nhanVien.HoTenNV }}
								</td>

								<td>
									<span
										class="badge"
										:class="
											nhanVien.ChucVu === 'Quản lý thư viện'
												? 'text-bg-primary'
												: 'text-bg-secondary'
										"
									>
										{{ nhanVien.ChucVu }}
									</span>
								</td>

								<td>
									{{ nhanVien.DiaChi }}
								</td>

								<td>
									{{ nhanVien.SoDienThoai }}
								</td>

								<td>
									<div class="d-flex gap-2">
										<RouterLink
											:to="{
												name: 'nhan-vien-edit',
												params: {
													msnv: nhanVien.MSNV,
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
											:disabled="
												deletingMSNV === nhanVien.MSNV ||
												nhanVien.MSNV === currentUser?.MSNV
											"
											@click="handleDelete(nhanVien)"
										>
											<i class="fa-solid fa-trash me-1"></i>

											{{
												deletingMSNV === nhanVien.MSNV ? "Đang xóa..." : "Xóa"
											}}
										</button>
									</div>
								</td>
							</tr>

							<tr v-if="nhanVienList.length === 0">
								<td colspan="6" class="py-5 text-center text-secondary">
									Không tìm thấy nhân viên phù hợp
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
						nhân viên
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
