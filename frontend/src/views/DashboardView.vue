<script setup>
import { onMounted, ref } from "vue";

import { getSachList } from "../services/sach.service.js";
import { getDocGiaList } from "../services/doc-gia.service.js";
import { getTheoDoiMuonSachList } from "../services/theo-doi-muon-sach.service.js";

const stats = ref({
	totalSach: 0,
	totalDocGia: 0,
	dangMuon: 0,
	quaHan: 0,
});

const isLoading = ref(false);
const errorMessage = ref("");

async function loadDashboardStats() {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		const [sachResult, docGiaResult, muonSachResult] = await Promise.all([
			getSachList({ page: 1, limit: 1 }),
			getDocGiaList({ page: 1, limit: 1 }),
			getTheoDoiMuonSachList({ page: 1, limit: 100 }),
		]);

		stats.value.totalSach = sachResult.pagination.totalItems;
		stats.value.totalDocGia = docGiaResult.pagination.totalItems;

		const muonSachData = muonSachResult.data;
		stats.value.dangMuon = muonSachData.filter(
			(item) => item.TrangThai === "dang-muon",
		).length;
		stats.value.quaHan = muonSachData.filter(
			(item) => item.TrangThai === "qua-han",
		).length;
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải dữ liệu thống kê";
	} finally {
		isLoading.value = false;
	}
}

onMounted(() => {
	loadDashboardStats();
});
</script>

<template>
	<main class="container-fluid px-4 py-4">
		<div class="mb-4">
			<h1 class="h3 mb-1">Tổng quan thư viện</h1>

			<p class="text-secondary mb-0">Theo dõi hoạt động mượn và trả sách</p>
		</div>

		<div v-if="errorMessage" class="alert alert-danger mb-4">
			{{ errorMessage }}
		</div>

		<div v-if="isLoading" class="text-center py-5">
			<div class="spinner-border text-primary" role="status"></div>

			<p class="text-secondary mt-3 mb-0">Đang tải dữ liệu thống kê...</p>
		</div>

		<div v-else class="row g-4">
			<div class="col-sm-6 col-xl-3">
				<article class="card h-100 border-0 shadow-sm">
					<div class="card-body">
						<i class="fa-solid fa-book fa-2x text-primary mb-3"></i>

						<p class="text-secondary mb-1">Đầu sách</p>

						<p class="display-6 fw-semibold mb-0">{{ stats.totalSach }}</p>
					</div>
				</article>
			</div>

			<div class="col-sm-6 col-xl-3">
				<article class="card h-100 border-0 shadow-sm">
					<div class="card-body">
						<i class="fa-solid fa-users fa-2x text-success mb-3"></i>

						<p class="text-secondary mb-1">Độc giả</p>

						<p class="display-6 fw-semibold mb-0">{{ stats.totalDocGia }}</p>
					</div>
				</article>
			</div>

			<div class="col-sm-6 col-xl-3">
				<article class="card h-100 border-0 shadow-sm">
					<div class="card-body">
						<i class="fa-solid fa-book-reader fa-2x text-warning mb-3"></i>

						<p class="text-secondary mb-1">Đang mượn</p>

						<p class="display-6 fw-semibold mb-0">{{ stats.dangMuon }}</p>
					</div>
				</article>
			</div>

			<div class="col-sm-6 col-xl-3">
				<article class="card h-100 border-0 shadow-sm">
					<div class="card-body">
						<i class="fa-solid fa-clock fa-2x text-danger mb-3"></i>

						<p class="text-secondary mb-1">Quá hạn</p>

						<p class="display-6 fw-semibold mb-0">{{ stats.quaHan }}</p>
					</div>
				</article>
			</div>
		</div>
	</main>
</template>
