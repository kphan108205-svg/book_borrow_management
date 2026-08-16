<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
	createSach,
	getSachById,
	updateSach,
} from "../services/sach.service.js";
import { getNhaXuatBanList } from "../services/nha-xuat-ban.service.js";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const nhaXuatBanList = ref([]);

const form = reactive({
	MaSach: "",
	TenSach: "",
	DonGia: null,
	SoQuyen: null,
	NamXuatBan: null,
	MaNXB: "",
	NguonGocTacGia: "",
});

const isEditMode = computed(() => Boolean(route.params.maSach));

const pageTitle = computed(() =>
	isEditMode.value ? "Chỉnh sửa sách" : "Thêm sách",
);

async function loadNhaXuatBan() {
	const result = await getNhaXuatBanList({
		page: 1,
		limit: 100,
	});

	nhaXuatBanList.value = result.data;
}

async function loadSach() {
	if (!isEditMode.value) {
		return;
	}

	const sach = await getSachById(route.params.maSach);

	form.MaSach = sach.MaSach;
	form.TenSach = sach.TenSach;
	form.DonGia = sach.DonGia;
	form.SoQuyen = sach.SoQuyen;
	form.NamXuatBan = sach.NamXuatBan;
	form.MaNXB = sach.MaNXB;
	form.NguonGocTacGia = sach.NguonGocTacGia;
}

function validateForm() {
	if (!form.MaSach.trim()) {
		return "Mã sách không được để trống";
	}

	if (!form.TenSach.trim()) {
		return "Tên sách không được để trống";
	}

	if (form.DonGia === null || form.DonGia < 0) {
		return "Đơn giá phải là số không âm";
	}

	if (
		form.SoQuyen === null ||
		!Number.isInteger(form.SoQuyen) ||
		form.SoQuyen < 0
	) {
		return "Số quyển phải là số nguyên không âm";
	}

	if (
		form.NamXuatBan === null ||
		!Number.isInteger(form.NamXuatBan) ||
		form.NamXuatBan < 0
	) {
		return "Năm xuất bản phải là số nguyên không âm";
	}

	if (!form.MaNXB) {
		return "Vui lòng chọn nhà xuất bản";
	}

	if (!form.NguonGocTacGia.trim()) {
		return "Nguồn gốc hoặc tác giả không được để trống";
	}

	return "";
}

function createRequestData() {
	return {
		MaSach: form.MaSach.trim(),
		TenSach: form.TenSach.trim(),
		DonGia: Number(form.DonGia),
		SoQuyen: Number(form.SoQuyen),
		NamXuatBan: Number(form.NamXuatBan),
		MaNXB: form.MaNXB,
		NguonGocTacGia: form.NguonGocTacGia.trim(),
	};
}

async function handleSubmit() {
	errorMessage.value = validateForm();

	if (errorMessage.value) {
		return;
	}

	isSubmitting.value = true;

	try {
		const requestData = createRequestData();

		if (isEditMode.value) {
			delete requestData.MaSach;

			await updateSach(route.params.maSach, requestData);
		} else {
			await createSach(requestData);
		}

		router.push({ name: "sach-list" });
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ||
			"Không thể lưu thông tin sách. Vui lòng thử lại.";
	} finally {
		isSubmitting.value = false;
	}
}

onMounted(async () => {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		await loadNhaXuatBan();
		await loadSach();
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ||
			"Không thể tải dữ liệu. Vui lòng thử lại.";
	} finally {
		isLoading.value = false;
	}
});
</script>

<template>
	<div>
		<div class="d-flex align-items-center justify-content-between mb-4">
			<h1 class="h3 mb-0">{{ pageTitle }}</h1>

			<RouterLink :to="{ name: 'sach-list' }" class="btn btn-outline-secondary">
				Quay lại
			</RouterLink>
		</div>

		<div v-if="errorMessage" class="alert alert-danger">
			{{ errorMessage }}
		</div>

		<div v-if="isLoading" class="text-center py-5">
			<div class="spinner-border text-primary" role="status"></div>
			<p class="mt-2 mb-0">Đang tải dữ liệu...</p>
		</div>

		<form v-else class="card shadow-sm" @submit.prevent="handleSubmit">
			<div class="card-body">
				<div class="row g-3">
					<div class="col-md-6">
						<label for="maSach" class="form-label">Mã sách</label>

						<input
							id="maSach"
							v-model="form.MaSach"
							type="text"
							class="form-control"
							:disabled="isEditMode"
							required
						/>
					</div>

					<div class="col-md-6">
						<label for="tenSach" class="form-label">Tên sách</label>

						<input
							id="tenSach"
							v-model="form.TenSach"
							type="text"
							class="form-control"
							required
						/>
					</div>

					<div class="col-md-4">
						<label for="donGia" class="form-label">Đơn giá</label>

						<input
							id="donGia"
							v-model.number="form.DonGia"
							type="number"
							min="0"
							class="form-control"
							required
						/>
					</div>

					<div class="col-md-4">
						<label for="soQuyen" class="form-label">Số quyển</label>

						<input
							id="soQuyen"
							v-model.number="form.SoQuyen"
							type="number"
							min="0"
							step="1"
							class="form-control"
							required
						/>
					</div>

					<div class="col-md-4">
						<label for="namXuatBan" class="form-label">Năm xuất bản</label>

						<input
							id="namXuatBan"
							v-model.number="form.NamXuatBan"
							type="number"
							min="0"
							step="1"
							class="form-control"
							required
						/>
					</div>

					<div class="col-md-6">
						<label for="maNXB" class="form-label">Nhà xuất bản</label>

						<select
							id="maNXB"
							v-model="form.MaNXB"
							class="form-select"
							required
						>
							<option value="">-- Chọn nhà xuất bản --</option>

							<option
								v-for="nhaXuatBan in nhaXuatBanList"
								:key="nhaXuatBan.MaNXB"
								:value="nhaXuatBan.MaNXB"
							>
								{{ nhaXuatBan.TenNXB }} ({{ nhaXuatBan.MaNXB }})
							</option>
						</select>
					</div>

					<div class="col-md-6">
						<label for="nguonGocTacGia" class="form-label">
							Nguồn gốc / Tác giả
						</label>

						<input
							id="nguonGocTacGia"
							v-model="form.NguonGocTacGia"
							type="text"
							class="form-control"
							required
						/>
					</div>
				</div>
			</div>

			<div class="card-footer d-flex justify-content-end gap-2">
				<RouterLink
					:to="{ name: 'sach-list' }"
					class="btn btn-outline-secondary"
				>
					Hủy
				</RouterLink>

				<button type="submit" class="btn btn-primary" :disabled="isSubmitting">
					{{
						isSubmitting
							? "Đang lưu..."
							: isEditMode
								? "Lưu thay đổi"
								: "Thêm sách"
					}}
				</button>
			</div>
		</form>
	</div>
</template>
